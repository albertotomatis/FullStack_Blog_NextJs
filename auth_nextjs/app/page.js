import Section1 from '@/app/components/blogComponents/section1'
import Section2 from '@/app/components/blogComponents/Section2'
import Section3 from '@/app/components/blogComponents/Section3'
import Section4 from '@/app/components/blogComponents/Section4'

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
            <section className="contenitore">
                <Section4 />
            </section>
        </div>
    )
}

