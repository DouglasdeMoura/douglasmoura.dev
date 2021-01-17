import Container from './container'

const Footer = () => {
  return (
    <Container>
      <footer className="border-t border-accent-7">
        <div className="py-10 flex flex-col lg:flex-row">
          <ul>
            <li className="mb-4">
              <a className="hover:underline" href="https://www.linkedin.com/in/dougmoura/">LinkedIn</a>
            </li>
            <li className="mb-4">
              <a className="hover:underline" href="https://instagram.com/douglasdemoura">Instagram</a>
            </li>
            <li className="mb-4">
              <a className="hover:underline" href="https://github.com/douglasdemoura">GitHub</a>
            </li>
          </ul>
          <div className="flex flex-col lg:flex-row justify-center lg:pl-4 lg:w-1/2">

          </div>
        </div>
      </footer>
    </Container>
  )
}

export default Footer
