import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { IOrder } from '@/models/order';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#f3f4f6',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
  },
  col4: {
    flex: 4,
  },
  col2: {
    flex: 2,
  },
  col1: {
    flex: 1,
  },
  text: {
    fontSize: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

interface ReceiptProps {
  order: IOrder;
}

export default function Receipt({ order }: ReceiptProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Kusina De Amadeo</Text>
          <Text style={styles.subtitle}>Order Receipt</Text>
        </View>

        {/* Order Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.row}>
            <Text style={[styles.col2, styles.text]}>Order ID:</Text>
            <Text style={[styles.col4, styles.text]}>{order._id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.col2, styles.text]}>Date:</Text>
            <Text style={[styles.col4, styles.text]}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.col2, styles.text]}>Status:</Text>
            <Text style={[styles.col4, styles.text]}>
              {order.orderStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Delivery Information */}
        {order.deliveryInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={styles.row}>
              <Text style={[styles.col2, styles.text]}>Address:</Text>
              <Text style={[styles.col4, styles.text]}>{order.deliveryInfo.address}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.col2, styles.text]}>Contact:</Text>
              <Text style={[styles.col4, styles.text]}>{order.deliveryInfo.contact}</Text>
            </View>
            {order.deliveryInfo.instructions && (
              <View style={styles.row}>
                <Text style={[styles.col2, styles.text]}>Instructions:</Text>
                <Text style={[styles.col4, styles.text]}>{order.deliveryInfo.instructions}</Text>
              </View>
            )}
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.col4, styles.text]}>{item.name}</Text>
              <Text style={[styles.col1, styles.text]}>{item.quantity}x</Text>
              <Text style={[styles.col2, styles.text]}>
                ₱{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.row, styles.bold]}>
            <Text style={[styles.col4, styles.text]}>Total</Text>
            <Text style={[styles.col1, styles.text]}></Text>
            <Text style={[styles.col2, styles.text]}>₱{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.row}>
            <Text style={[styles.col2, styles.text]}>Method:</Text>
            <Text style={[styles.col4, styles.text]}>{order.paymentMethod.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.col2, styles.text]}>Status:</Text>
            <Text style={[styles.col4, styles.text]}>{order.paymentStatus.toUpperCase()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
