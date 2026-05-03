import EditorLoader from '@/components/EditorLoader';
import { PageLayout } from '@/components/PageLayout';
import { getTutorialForPath } from '@/lib/tutorials';
import { useRouter } from 'next/router';
import Custom404 from '../404';


export default function TutorialPage() {
    const router = useRouter();
    const { slug } = router.query;
    if (!slug) {
        return null
    }
    const tutorialIdString = typeof slug === 'string' ? slug : undefined;
    const tutorial = tutorialIdString && getTutorialForPath(tutorialIdString);

    if (!tutorial) {
        return <Custom404 path='tutorial' item={tutorialIdString} />
    }

    return (
        <PageLayout noPageScroll>
            <EditorLoader tutorial={tutorial} />
        </PageLayout>
    )
}
