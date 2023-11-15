import Menu from './Menu'
import UserToolbar from './UserToolbar'

const Header = () => {
  return (
    <header style={{ position: 'sticky', top: '0', zIndex: '100' }}>
      <UserToolbar />
      <Menu />
    </header>
  )
}

export default Header
