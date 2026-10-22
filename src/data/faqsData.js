export const FAQS_DATA = [
  {
    id: 'purchase-course',
    category: 'Purchasing & Orders',
    question: 'How do I purchase a course?',
    answer:
      'Browse our course catalog, click "Add to Cart" to collect multiple courses or click "Buy Now" on any course card for instant direct checkout. When ready, navigate to your Shopping Cart, review your itemized summary, and proceed through our seamless demo checkout.',
    tag: 'Purchasing'
  },
  {
    id: 'add-to-cart-work',
    category: 'Cart & Checkout',
    question: 'How does Add to Cart work?',
    answer:
      'Clicking "Add to Cart" saves the selected course into your active cart and triggers a success toast notification. The cart counter in the top navigation updates dynamically. Duplicate additions for the same course are automatically prevented since courses are digital assets.',
    tag: 'Cart'
  },
  {
    id: 'complete-checkout',
    category: 'Cart & Checkout',
    question: 'How can I complete checkout?',
    answer:
      'From your Shopping Cart, cll̥ick "Proceed to Checkout". Provide your student name and email address in the validated checkout form, review your order breakdown, and click "Continue to Payment" to generate your order reference and proceed to the demo QR payment screen.',

    tag: 'Checkout'
  },
  {
    id: 'qr-code-demo',
    category: 'Payment Demo',
    question: 'How does the QR code demo work?',
    answer:
      'The payment page displays a demo QR code representing your generated order reference and total amount. To test the transaction flow without real currency, simply click the "Simulate Successful Payment" button. This triggers instant order fulfillment and navigates to your confirmation receipt.',
    tag: 'QR Payment'
  },
  {
    id: 'real-payment-gateway',
    category: 'Payment Demo',
    question: 'Is the payment system connected to a real payment gateway?',
    answer:
      'No. This is strictly a frontend demonstration running in DEMO MODE. No real bank accounts, UPI IDs, credit cards, or external payment gateways are charged. All order references, receipts, and course unlocks are handled entirely client-side.',
    tag: 'Demo Mode'
  },
  {
    id: 'find-purchased-courses',
    category: 'My Courses & Access',
    question: 'Where can I find my purchased courses?',
    answer:
      'Once a demo order is simulated as successful, all acquired courses are immediately listed in your "My Courses" dashboard (/my-courses) as well as your learning workspace. You can click "Start Learning" on any course card to access its full video curriculum and interactive lessons.',
    tag: 'Access'
  },
  {
    id: 'cancel-order',
    category: 'Purchasing & Orders',
    question: 'What happens if I cancel an order?',
    answer:
      'If you click "Cancel Order" on the payment page, the pending transaction is safely aborted and discarded. Your original items remain preserved in your shopping cart so you can resume, modify, or complete checkout whenever you are ready.',
    tag: 'Orders'
  },
  {
    id: 'cart-persistence',
    category: 'Cart & Checkout',
    question: 'Will my cart items remain after refreshing the page?',
    answer:
      'Yes! All cart contents, pending checkout drafts, and completed demo order records are automatically synchronized and persisted in your browser’s localStorage. Your items will remain intact across page refreshes, tab closures, and browser restarts.',
    tag: 'Persistence'
  }
];

export const FAQ_CATEGORIES = [
  'All',
  'Purchasing & Orders',
  'Cart & Checkout',
  'Payment Demo',
  'My Courses & Access'
];
