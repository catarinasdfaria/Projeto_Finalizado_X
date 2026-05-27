import Footer from './Footer';
import LeftMenu from './LeftMenu';
import Header from './header';
import Feed from './Feed';

function Content() {
  return (
    
    <div className="row MainPage">
        <Header />
        <LeftMenu />
        <Feed />
        <Footer />
    </div>
  )
}

export default Content