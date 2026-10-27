# Registration form handler (SCORE QC hosting)

The form at https://scoreqc.com/registration/ sends each registration to `submit.php`. That script
checks the details and emails them to info@scoreqc.com through SCORE QC's own mail server
(`mail.scoreqc.com`). It can also save each registration to a MySQL table. No third-party service is
involved.

The script is hosted on the same Plesk (Windows) account as the task portal, at:

    https://taskportal.scoreqc.com/registration/submit.php

## Setup

1. **Create a mailbox to send from.** In Plesk → Mail, create `noreply@scoreqc.com` with a strong
   password. Any existing scoreqc.com mailbox also works.
2. **Upload this folder.** In Plesk → Files, open the task portal's site root (the folder that
   contains `etms`). Create a folder called `registration` and upload into it:
   - `submit.php`
   - `web.config`
   - `config.sample.php`
   - the `PHPMailer` folder (all of its files)
3. **Create the settings file.** In that `registration` folder, copy `config.sample.php` to
   `config.php`. Edit `config.php` and set `smtp.pass` to the mailbox password. Change `from_email`
   and `smtp.user` too if you used a different mailbox.
4. **Check the PHP version.** In Plesk → PHP Settings for taskportal.scoreqc.com, the PHP version
   must be 7.0 or newer, with the `openssl` extension enabled. It usually is.
5. **Tell the web developer** it's uploaded. They switch the website form over and send a test.

## Optional: also save registrations to a database

1. In Plesk → Databases, choose (or create) a MySQL database. Open phpMyAdmin and run `schema.sql`.
2. In `config.php`, set `db.enabled` to `true` and fill in `dsn`, `user` and `pass`.

Registrations then go into the `website_registrations` table as well as being emailed. To show them
inside the task portal, the portal's developer needs to add a page that reads this table.

## If sending fails

- Check the site's error log in Plesk → Logs. Lines start with `scoreqc registration`.
- If the log mentions a certificate error, set `allow_self_signed` to `true` in `config.php`.
- If port 587 is blocked, try `'port' => 465` with `'secure' => 'ssl'`.

## Security notes

- `config.php` holds the mailbox password. `web.config` blocks it (and the PHPMailer folder) from
  being downloaded. Never upload it anywhere public or commit it to git.
- Only `https://scoreqc.com` and `https://www.scoreqc.com` may post to the script. It also
  limits each visitor to 5 submissions per 10 minutes, and silently drops bots that fill the
  hidden trap field.
