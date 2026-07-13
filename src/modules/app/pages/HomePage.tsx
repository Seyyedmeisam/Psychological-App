import { Link } from '@tanstack/react-router'
import { m } from '@/core/i18n/paraglide/messages.js'
import { useMe } from '@/modules/app/hooks'
import { Button } from '@/modules/app/components/ui/button'

export default function HomePage() {
  const { data: user } = useMe()

  return (
    <section className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-foreground">{m.home_title()}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{m.home_description()}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {user ? (
          <>
            <Button asChild>
              <Link to="/books">{m.home_browse_books()}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/about">{m.home_about()}</Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild>
              <Link to="/register">{m.auth_get_started()}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login">{m.auth_login()}</Link>
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
