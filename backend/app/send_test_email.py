import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# --- Configuration ---
SMTP_SERVER = 'smtp.hostinger.com'          # Hostinger SMTP server
SMTP_PORT = 587                             # TLS port
SENDER_EMAIL = 'support@yogforever.com'     # Your email address
SENDER_PASSWORD = 'Adviktej$2020'     # Your email password
RECIPIENT_EMAIL = 'tijender.singh7@gmail.com'   # Recipient's email address

# --- Compose the Email ---
msg = MIMEMultipart()
msg['From'] = SENDER_EMAIL
msg['To'] = RECIPIENT_EMAIL
msg['Subject'] = "Test Email from Python Script"

body = """
Hello,

This is a test email sent from a Python script using Hostinger's SMTP server.

If you received this email, the setup is successful!

Best regards,
Yog Forever Team
"""
msg.attach(MIMEText(body, 'plain'))

# --- Send the Email ---
try:
    # Establish a secure session with the SMTP server using TLS
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()  # Upgrade the connection to secure TLS
    server.login(SENDER_EMAIL, SENDER_PASSWORD)  # Login to the SMTP server

    # Send the email
    server.send_message(msg)
    server.quit()  # Terminate the SMTP session

    print(f"Test email sent successfully to {RECIPIENT_EMAIL}.")
except Exception as e:
    print(f"Failed to send email. Error: {e}")
