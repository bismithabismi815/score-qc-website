<?php
// Receives the candidate registration form from https://scoreqc.com/registration/
// and emails it to the office through SCORE QC's own mail server (SMTP via PHPMailer).
// Optionally also saves each registration to a MySQL table (see schema.sql).
// Settings live in config.php (copy config.sample.php). Requires PHP 7.0+.

ini_set('display_errors', '0'); // warnings go to the server log, never into the JSON reply

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

$config = require __DIR__ . '/config.php';

// ---- CORS: only the SCORE QC website may post here -------------------------
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $config['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond($code, $ok, $message = '') {
    http_response_code($code);
    echo json_encode(array('ok' => $ok, 'message' => $message));
    exit;
}

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';
if ($method === 'OPTIONS') respond(204, true);
if ($method !== 'POST') respond(405, false, 'Method not allowed.');
if (!in_array($origin, $config['allowed_origins'], true)) respond(403, false, 'Forbidden.');

// ---- Simple rate limit: N submissions per IP per window ---------------------
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
$rlFile = rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'scoreqc_reg_' . md5($ip);
$now = time();
$hits = array();
if (is_file($rlFile)) {
    $hits = json_decode((string) @file_get_contents($rlFile), true);
    if (!is_array($hits)) $hits = array();
    $hits = array_values(array_filter($hits, function ($t) use ($now, $config) { return $t > $now - $config['rate_window']; }));
}
if (count($hits) >= $config['rate_limit']) respond(429, false, 'Too many submissions. Please try again later.');

// ---- Read and clean input ---------------------------------------------------
$raw = file_get_contents('php://input');
if (strlen($raw) > 20000) respond(413, false, 'Submission too large.');
$in = json_decode($raw, true);
if (!is_array($in)) respond(400, false, 'Invalid submission.');

// Honeypot: real visitors never fill this hidden field. Pretend success to bots.
if (!empty($in['_honey'])) respond(200, true);

// field key => [label, required, max length]
$FIELDS = array(
    'course_title'      => array('Course Title', true, 120),
    'twi_id'            => array('TWI Candidate ID', false, 40),
    'seminar_date'      => array('Seminar Date', true, 10),
    'exam_date'         => array('Date of Examination', true, 10),
    'full_name'         => array('Full Name', true, 120),
    'dob'               => array('Date of Birth', true, 10),
    'age'               => array('Age', true, 3),
    'email'             => array('Email', true, 160),
    'phone'             => array('Contact Number', true, 20),
    'alt_phone'         => array('Alternate Contact Number', true, 20),
    'perm_address'      => array('Permanent Address', true, 600),
    'perm_pin'          => array('Permanent Pin Code', true, 6),
    'comm_address'      => array('Communication Address', false, 600),
    'comm_pin'          => array('Communication Pin Code', false, 6),
    'qualification'     => array('Course Completed', true, 120),
    'completion_date'   => array('Date of Completion', true, 10),
    'ndt_certification' => array('NDT Certification', false, 15),
    'company'           => array('Company Name', false, 160),
    'designation'       => array('Designation', false, 120),
    'exp_from'          => array('Experience From', false, 10),
    'exp_to'            => array('Experience To', false, 10),
);

$data = array();
foreach ($FIELDS as $key => $f) {
    $v = isset($in[$key]) && is_scalar($in[$key]) ? trim((string) $in[$key]) : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v); // strip control chars, keep newlines
    if ($v === null) $v = '';
    if ($f[1] && $v === '') respond(422, false, 'Please fill in ' . $f[0] . '.');
    $len = function_exists('mb_strlen') ? mb_strlen($v, 'UTF-8') : preg_match_all('/./us', $v);
    if ($len > $f[2]) respond(422, false, $f[0] . ' is too long.');
    $data[$key] = $v;
}

$dateRe = '/^\d{2}\/\d{2}\/\d{4}$/';
foreach (array('seminar_date', 'exam_date', 'dob', 'completion_date', 'exp_from', 'exp_to') as $k) {
    if ($data[$k] !== '' && !preg_match($dateRe, $data[$k])) respond(422, false, $FIELDS[$k][0] . ' is not a valid date.');
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) respond(422, false, 'Please enter a valid email address.');
foreach (array('phone', 'alt_phone') as $k) {
    if (strlen(preg_replace('/\D/', '', $data[$k])) < 10) respond(422, false, 'Please enter a valid ' . $FIELDS[$k][0] . '.');
}
if (!preg_match('/^\d{6}$/', $data['perm_pin'])) respond(422, false, 'Please enter a 6-digit pin code.');
if ($data['comm_pin'] !== '' && !preg_match('/^\d{6}$/', $data['comm_pin'])) respond(422, false, 'Please enter a 6-digit communication pin code.');
if (!preg_match('/^\d{1,3}$/', $data['age']) || (int) $data['age'] < 15 || (int) $data['age'] > 80) respond(422, false, 'Please enter a valid age.');
if ($data['ndt_certification'] === '') $data['ndt_certification'] = 'NOT SPECIFIED';

// ---- Optional: save to database ---------------------------------------------
$savedId = null;
if (!empty($config['db']['enabled'])) {
    try {
        $pdo = new PDO($config['db']['dsn'], $config['db']['user'], $config['db']['pass'],
            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $cols = array_keys($FIELDS);
        $sql = 'INSERT INTO ' . $config['db']['table'] . ' (' . implode(',', $cols) . ', ip, submitted_at) VALUES (:'
            . implode(',:', $cols) . ', :ip, :submitted_at)';
        $st = $pdo->prepare($sql);
        foreach ($cols as $c) $st->bindValue(':' . $c, $data[$c]);
        $st->bindValue(':ip', $ip);
        $st->bindValue(':submitted_at', date('Y-m-d H:i:s'));
        $st->execute();
        $savedId = $pdo->lastInsertId();
    } catch (Exception $e) {
        error_log('scoreqc registration DB error: ' . $e->getMessage());
        // carry on: the email is still sent
    }
}

// ---- Build and send the email -----------------------------------------------
$h = function ($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); };
$sections = array(
    'Course details'     => array('course_title', 'twi_id', 'seminar_date', 'exam_date'),
    'Personal details'   => array('full_name', 'dob', 'age', 'email', 'phone', 'alt_phone', 'perm_address', 'perm_pin', 'comm_address', 'comm_pin'),
    'Qualification'      => array('qualification', 'completion_date', 'ndt_certification'),
    'Experience'         => array('company', 'designation', 'exp_from', 'exp_to'),
);
$html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#0d1b26;">'
    . '<h2 style="margin:0 0 4px;">New candidate registration</h2>'
    . '<p style="margin:0 0 18px;color:#555;">Submitted ' . $h(date('d/m/Y H:i')) . ' from scoreqc.com/registration'
    . ($savedId ? ' &middot; record #' . $h($savedId) : '') . '</p>';
$text = "New candidate registration\nSubmitted " . date('d/m/Y H:i') . "\n";
foreach ($sections as $title => $keys) {
    $html .= '<h3 style="margin:18px 0 6px;color:#1f7a2a;">' . $h($title) . '</h3><table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:680px;">';
    $text .= "\n" . strtoupper($title) . "\n";
    foreach ($keys as $k) {
        $v = $data[$k] === '' ? '—' : $data[$k];
        $html .= '<tr><td style="border:1px solid #ddd;background:#f6f8fa;width:38%;font-weight:bold;">' . $h($FIELDS[$k][0])
            . '</td><td style="border:1px solid #ddd;">' . nl2br($h($v)) . '</td></tr>';
        $text .= $FIELDS[$k][0] . ': ' . $v . "\n";
    }
    $html .= '</table>';
}
$html .= '</div>';

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $config['smtp']['host'];
    $mail->Port       = $config['smtp']['port'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp']['user'];
    $mail->Password   = $config['smtp']['pass'];
    $mail->SMTPSecure = $config['smtp']['secure']; // 'tls' (587) or 'ssl' (465)
    if (!empty($config['smtp']['allow_self_signed'])) {
        $mail->SMTPOptions = array('ssl' => array('verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true));
    }
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_email'], $config['from_name']);
    foreach ($config['to'] as $to) $mail->addAddress($to);
    $mail->addReplyTo($data['email'], $data['full_name']);
    $mail->Subject = 'Candidate registration: ' . $data['full_name'] . ' – ' . $data['course_title'];
    $mail->isHTML(true);
    $mail->Body    = $html;
    $mail->AltBody = $text;
    $mail->send();
} catch (MailException $e) {
    error_log('scoreqc registration mail error: ' . $mail->ErrorInfo);
    respond(502, false, 'Your registration could not be sent. Please try again or email ' . $config['to'][0] . '.');
}

$hits[] = $now;
@file_put_contents($rlFile, json_encode($hits));
respond(200, true);
