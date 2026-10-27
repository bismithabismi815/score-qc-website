-- Optional: table for saving website registrations (MySQL / MariaDB).
-- Run once in phpMyAdmin (or your database tool) on the database named in config.php.

CREATE TABLE IF NOT EXISTS website_registrations (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  course_title      VARCHAR(120) NOT NULL,
  twi_id            VARCHAR(40)  NULL,
  seminar_date      VARCHAR(10)  NOT NULL,
  exam_date         VARCHAR(10)  NOT NULL,
  full_name         VARCHAR(120) NOT NULL,
  dob               VARCHAR(10)  NOT NULL,
  age               VARCHAR(3)   NOT NULL,
  email             VARCHAR(160) NOT NULL,
  phone             VARCHAR(20)  NOT NULL,
  alt_phone         VARCHAR(20)  NOT NULL,
  perm_address      TEXT         NOT NULL,
  perm_pin          VARCHAR(6)   NOT NULL,
  comm_address      TEXT         NULL,
  comm_pin          VARCHAR(6)   NULL,
  qualification     VARCHAR(120) NOT NULL,
  completion_date   VARCHAR(10)  NOT NULL,
  ndt_certification VARCHAR(15)  NULL,
  company           VARCHAR(160) NULL,
  designation       VARCHAR(120) NULL,
  exp_from          VARCHAR(10)  NULL,
  exp_to            VARCHAR(10)  NULL,
  ip                VARCHAR(45)  NULL,
  submitted_at      DATETIME     NOT NULL,
  KEY idx_submitted (submitted_at),
  KEY idx_email (email)
) DEFAULT CHARSET=utf8mb4;
