import { PageLayout } from "@/components/PageLayout"

export default function Custom404({ path, item }: { path?: string, item?: string }) {


    return (
        <PageLayout>
            <h1>404 - Page Not Found!</h1>
            <h2>{path}/{item}</h2>
        </PageLayout>
    )
}