import { Image, Layout } from "antd";
import SideMenu from "./components/SideMenu";
import AppRoutes from "./components/AppRoutes";
import RestaurantContextProvider from "./contexts/RestaurantContext";

const { Sider, Content, Footer } = Layout;
function App() {
  return (
    <RestaurantContextProvider>
      <Layout>
        <Sider style={{ height: "100vh", backgroundColor: "white" }}>
          <Image src="https://i.etsystatic.com/31726496/r/il/b2b2ce/4710263873/il_570xN.4710263873_4yst.jpg" />
          <SideMenu />
        </Sider>
        <Layout>
          <Content style={{ backgroundColor: "lightgrey" }}>
            <AppRoutes />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Anyone Can Cook | Kitchen Dashboard @2024
          </Footer>
        </Layout>
      </Layout>
    </RestaurantContextProvider>
  );
}

export default App;