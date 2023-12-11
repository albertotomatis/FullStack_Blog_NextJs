import Section1 from '@/app/components/blogComponents/section1'
import Section2 from '@/app/components/blogComponents/Section2'
import Section3 from '@/app/components/blogComponents/Section3'


export default function Blog() {
    return (
        <div>
            <main className="contenitore">
                <Section1 />
            </main>
            <section className="contenitore">
                <Section2 />
            </section>
            <section className="contenitore">
                <Section3 />
            </section>
        </div>
    )
}

