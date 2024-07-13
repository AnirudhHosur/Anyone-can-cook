import { Button, Card, Descriptions, Divider, List } from "antd";
import dishes from "../../assets/data/dishes.json"
import { useParams } from "react-router-dom";

const DetailedOrder = () => {

    const { id } = useParams();

    return (
        <Card title={`Order ${id}`} style={{ margin: 20 }}>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Customer">Anirudh Hosur</Descriptions.Item>
                <Descriptions.Item label="Customer Address">4003 36th St NW, Calgary, AB</Descriptions.Item>
            </Descriptions>
            <Divider />

            <List
                dataSource={dishes}
                renderItem={(dishItem) => (
                    <List.Item>
                        <div style={{ fontWeight: 'bold' }}>{dishItem.name} x{dishItem.quantity}</div>
                        <div>${dishItem.price}</div>
                    </List.Item>
                )}
            />
            <Divider />

            <div style={styles.totalSumContainer}>
                <h2>Total: </h2>
                <h2 style={styles.totalPrice}>$42.31 </h2>
            </div>
            <Divider />

            <div style={styles.buttonsContainer}>
                <Button block type="primary" danger style={styles.button}>Decline Order</Button>
                <Button block type="primary" style={styles.button}>Accept Order</Button>
            </div>
            <Button block type="primary">Food is Done</Button>
        </Card>
    )
}

const styles = {
    totalSumContainer: {
        flexDirection: 'row',
        display: 'flex'
    },

    totalPrice: {
        marginLeft: 'auto',
        fontWeight: 'bold'
    },

    buttonsContainer: {
        display: 'flex',
        paddingBottom: 30
    },
    button: {
        marginRight: 30,
        marginLeft: 20
    }
}

export default DetailedOrder;