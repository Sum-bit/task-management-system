import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'sumedhnaiduakula@gmail.com'         # 🔁 Replace with your Gmail
EMAIL_HOST_PASSWORD = 'owwidimhzcvilwpu'   # 🔁 Replace with your App Password

def send_test_email(to_email):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_HOST_USER
        msg['To'] = to_email
        msg['Subject'] = 'SMTP Test Email'
        body = 'This is a test email sent from Django SMTP config using Gmail.'
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        server.send_message(msg)
        server.quit()

        print('✅ Email sent successfully!')
        return True
    except Exception as e:
        print(f'❌ Failed to send email: {e}')
        return False
