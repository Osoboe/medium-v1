import Link from 'next/link'

const Nav = () => {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt="로고"
          />
        </Link>

        <div className="hidden items-center space-x-5 md:inline-flex">
          <Link href={`/about`}>
            <h3 className="cursor-pointer">About</h3>
          </Link>
          <Link href={`/contact`}>
          <h3 className="cursor-pointer">Contact</h3>
          </Link>
          <h3 className="rounded-full bg-green-600 px-5 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="rounded-full border border-green-600 px-5 py-1">
          Get Started
        </h3>
      </div>
    </nav>
  )
}

export default Nav