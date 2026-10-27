<?php
// Copy this file to config.php (in the same folder) and fill in the real values.
// config.php holds passwords: never commit it or put it anywhere public.

return array(
    // Who receives each registration.
    'to' => array('info@scoreqc.com'),

    // Sender shown on the email. Must be a real mailbox on scoreqc.com (the one used to log in below).
    'from_email' => 'noreply@scoreqc.com',
    'from_name'  => 'SCORE QC Website',

    // Your own mail server. Use the login of the mailbox above.
    'smtp' => array(
        'host'   => 'mail.scoreqc.com',
        'port'   => 587,          // 587 with 'tls', or 465 with 'ssl'
        'secure' => 'tls',
        'user'   => 'noreply@scoreqc.com',
        'pass'   => 'CHANGE_ME',
        // Set true only if the mail server's certificate doesn't match mail.scoreqc.com and sending fails.
        'allow_self_signed' => false,
    ),

    // Only these websites may send registrations to this script.
    'allowed_origins' => array('https://scoreqc.com', 'https://www.scoreqc.com'),

    // At most this many registrations per visitor IP within the window (seconds).
    'rate_limit'  => 5,
    'rate_window' => 600,

    // Optional: also save each registration to MySQL. Create the table with schema.sql first.
    'db' => array(
        'enabled' => false,
        'dsn'     => 'mysql:host=localhost;dbname=YOUR_DATABASE;charset=utf8mb4',
        'user'    => 'YOUR_DB_USER',
        'pass'    => 'YOUR_DB_PASSWORD',
        'table'   => 'website_registrations',
    ),
);
