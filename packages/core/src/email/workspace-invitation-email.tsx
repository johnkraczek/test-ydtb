import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    pixelBasedPreset,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import { Building2, Users } from 'lucide-react';

interface WorkspaceInvitationEmailProps {
    username?: string;
    invitedByUsername?: string;
    invitedByEmail?: string;
    workspaceName?: string;
    workspaceSlug?: string;
    inviteLink?: string;
    message?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const WorkspaceInvitationEmail = ({
    username,
    invitedByUsername,
    invitedByEmail,
    workspaceName,
    workspaceSlug,
    inviteLink,
    message,
}: WorkspaceInvitationEmailProps) => {
    const previewText = `Join ${invitedByUsername} on ${workspaceName} workspace`;

    return (
        <Html>
            <Head />
            <Tailwind
                config={{
                    presets: [pixelBasedPreset],
                }}
            >
                <Body className="mx-auto my-auto bg-white px-2 font-sans">
                    <Preview>{previewText}</Preview>
                    <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
                        <Section className="mt-[32px]">
                            <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                        </Section>
                        <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
                            Join <strong>{workspaceName}</strong> on <strong>YDTB</strong>
                        </Heading>
                        <Text className="text-[14px] text-black leading-[24px]">
                            Hello {username || 'there'},
                        </Text>
                        <Text className="text-[14px] text-black leading-[24px]">
                            <strong>{invitedByUsername}</strong> (
                            <Link
                                href={`mailto:${invitedByEmail}`}
                                className="text-blue-600 no-underline"
                            >
                                {invitedByEmail}
                            </Link>
                            ) has invited you to join the <strong>{workspaceName}</strong> workspace on{' '}
                            <strong>YDTB</strong> - Your Digital Toolbox.
                        </Text>

                        {message && (
                            <Text className="text-[14px] text-gray-600 leading-[24px] italic mt-4">
                                "{message}"
                            </Text>
                        )}

                        <Section className="mt-[32px] mb-[32px] text-center">
                            <Button
                                className="rounded bg-[#4f46e5] px-5 py-3 text-center font-semibold text-[14px] text-white no-underline hover:bg-[#4338ca]"
                                href={inviteLink}
                            >
                                Accept Invitation
                            </Button>
                        </Section>

                        <Text className="text-[14px] text-black leading-[24px]">
                            or copy and paste this URL into your browser:{' '}
                            <Link href={inviteLink} className="text-blue-600 no-underline break-all">
                                {inviteLink}
                            </Link>
                        </Text>

                        <Text className="text-[14px] text-gray-600 leading-[24px] mt-4">
                            Your workspace will be accessible at:{' '}
                            <Link href={`${baseUrl}/${workspaceSlug}`} className="text-blue-600 no-underline">
                                {workspaceSlug}.ydtb.app
                            </Link>
                        </Text>

                        <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />

                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Users className="w-4 h-4 text-gray-400" />
                            <Text className="text-[#666666] text-[12px] leading-[24px]">
                                YDTB - Your Digital Toolbox
                            </Text>
                        </div>

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This invitation was intended for{' '}
                            <span className="text-black">{username}</span>. If you were not expecting this
                            invitation, you can ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WorkspaceInvitationEmail;