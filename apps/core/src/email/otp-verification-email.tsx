import { Html, Text, Container, Heading, Section } from "@react-email/components";

interface OtpVerificationEmailProps {
  userName?: string;
  otp: string;
  expirationMinutes?: number;
}

export default function OtpVerificationEmail({
  userName,
  otp,
  expirationMinutes = 5
}: OtpVerificationEmailProps) {
  return (
    <Html>
      <Container style={styles.container}>
        <Heading style={styles.heading}>Verify your email for YDTB</Heading>

        {userName && (
          <Text style={styles.text}>Hi {userName},</Text>
        )}

        <Text style={styles.text}>
          Your verification code is:
        </Text>

        <Container style={styles.otpContainer}>
          <Text style={styles.otp}>{otp}</Text>
        </Container>

        <Text style={styles.text}>
          This code will expire in {expirationMinutes} minutes.
        </Text>

        <Text style={styles.text}>
          If you didn't request this code, you can safely ignore this email.
        </Text>

        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            Thanks,
            <br />
            The YDTB Team
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const styles = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#4b5563',
    marginBottom: '16px',
  },
  otpContainer: {
    backgroundColor: '#f3f4f6',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    margin: '20px 0',
  },
  otp: {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '8px',
    color: '#1f2937',
  },
  footer: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
  },
};