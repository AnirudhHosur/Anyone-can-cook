import { Route, Routes } from "react-router-dom";
import DetailedOrder from "./modules/DetailedOrder";
import Orders from "./modules/DetailedOrder/Orders";
import { Image, Layout } from "antd";

const { Sider, Content, Footer } = Layout;
function App() {
  return (
    <Layout>
      <Sider style={{ height: "100vh", backgroundColor: "white" }}>
        <Image src="https://i.etsystatic.com/31726496/r/il/b2b2ce/4710263873/il_570xN.4710263873_4yst.jpg" />
      </Sider>
      <Layout>
        <Content>
          <Routes>
            <Route path="" element={<Orders />} />
            <Route path="order/:id" element={<DetailedOrder />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Anyone can cook kitchen dashboard @2024
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;