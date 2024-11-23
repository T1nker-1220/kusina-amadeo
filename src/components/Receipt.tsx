import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
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
  bold: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
  },
  total: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
  },
});

interface ReceiptProps {
  order: IOrder;
}

const Receipt = ({ order }: ReceiptProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          src="/logo.png" 
          style={styles.logo}
        />
        <Text style={styles.title}>Kusina De Amadeo</Text>
        <Text style={styles.subtitle}>Your Comfort Food Destination</Text>
        <Text style={styles.subtitle}>123 Main Street, City</Text>
        <Text style={styles.subtitle}>Tel: (123) 456-7890</Text>
      </View>

      {/* Order Details */}
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
          <Text style={[styles.col2, styles.text]}>Payment Method:</Text>
          <Text style={[styles.col4, styles.text]}>
            {order.paymentMethod.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Delivery Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        <View style={styles.row}>
          <Text style={[styles.col2, styles.text]}>Address:</Text>
          <Text style={[styles.col4, styles.text]}>{order.deliveryInfo.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.col2, styles.text]}>Contact:</Text>
          <Text style={[styles.col4, styles.text]}>{order.deliveryInfo.contactNumber}</Text>
        </View>
        {order.deliveryInfo.notes && (
          <View style={styles.row}>
            <Text style={[styles.col2, styles.text]}>Notes:</Text>
            <Text style={[styles.col4, styles.text]}>{order.deliveryInfo.notes}</Text>
          </View>
        )}
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={[styles.row, styles.bold]}>
          <Text style={[styles.col4, styles.text]}>Item</Text>
          <Text style={[styles.col1, styles.text]}>Qty</Text>
          <Text style={[styles.col2, styles.text]}>Price</Text>
          <Text style={[styles.col2, styles.text]}>Total</Text>
        </View>
        {order.items.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.col4}>
              <Text style={styles.text}>{item.name}</Text>
              {item.addons && item.addons.length > 0 && (
                <Text style={[styles.text, { fontSize: 8, color: '#666' }]}>
                  Add-ons: {item.addons.map(addon => addon.name).join(', ')}
                </Text>
              )}
            </View>
            <Text style={[styles.col1, styles.text]}>{item.quantity}</Text>
            <Text style={[styles.col2, styles.text]}>₱{item.price.toFixed(2)}</Text>
            <Text style={[styles.col2, styles.text]}>
              ₱{((item.price + (item.addons?.reduce((acc, addon) => acc + addon.price, 0) || 0)) * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.total}>
          <View style={styles.row}>
            <Text style={[styles.col4, styles.text]}></Text>
            <Text style={[styles.col1, styles.text]}></Text>
            <Text style={[styles.col2, styles.text, styles.bold]}>Subtotal:</Text>
            <Text style={[styles.col2, styles.text]}>₱{order.total.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.col4, styles.text]}></Text>
            <Text style={[styles.col1, styles.text]}></Text>
            <Text style={[styles.col2, styles.text, styles.bold]}>Delivery Fee:</Text>
            <Text style={[styles.col2, styles.text]}>₱50.00</Text>
          </View>
          <View style={[styles.row, styles.bold]}>
            <Text style={[styles.col4, styles.text]}></Text>
            <Text style={[styles.col1, styles.text]}></Text>
            <Text style={[styles.col2, styles.text]}>Total:</Text>
            <Text style={[styles.col2, styles.text]}>₱{(order.total + 50).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Thank you for choosing Kusina De Amadeo!</Text>
        <Text>This is a computer-generated receipt. No signature required.</Text>
      </View>
    </Page>
  </Document>
);

export default Receipt;
