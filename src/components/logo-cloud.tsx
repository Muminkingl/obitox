export default function LogoCloud() {
    return (
        <section className="bg-background py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-center text-4xl font-medium tracking-tight sm:text-5xl">Trusted by experts.<br />Used by the leaders.</h2>
                <div className="mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-x-20 gap-y-16 sm:gap-x-24 sm:gap-y-20">
                    <img className="h-15 w-fit dark:invert" src="/ember.svg" alt="Ember Logo" height="96" width="auto" />
                    <img className="h-15 w-fit dark:invert" src="/gatsby.svg" alt="Gatsby Logo" height="96" width="auto" />
                    <img className="h-15 w-fit dark:invert" src="https://cdn.simpleicons.org/sass" alt="Sass Logo" height="96" width="auto" />
                    <img className="h-15 w-fit dark:invert" src="/wayl.svg" alt="Wayl Logo" height="96" width="auto" />
                </div>
            </div>
        </section>
    )
}
