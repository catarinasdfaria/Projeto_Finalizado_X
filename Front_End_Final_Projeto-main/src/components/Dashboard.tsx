
import Header from './header';
import Footer from './Footer';
import AdminUsers from './AdminUsers';
import AdminTweets from './AdminTweets';
// Import the radar chart

function Dashboard() {

 //carregamento médio
  return (
    <div className="App dashboard-container">
      <Header />
      <AdminUsers/>
      <AdminTweets /> 
      <Footer />
    </div>
  )
}

export default Dashboard