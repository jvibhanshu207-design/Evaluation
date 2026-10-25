import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCourses } from './CourseContext';
import { getStoredData, setStoredData } from '../utils/storage';
import { sound } from '../utils/sound';

const STORAGE_KEY_TRANSACTIONS = 'learnsphere_transactions';

const DEFAULT_TRANSACTIONS = [
  {
    id: 'TXN-LS-M8K2A1-8841',
    courseId: 'java-programming',
    courseTitle: 'Java Programming Masterclass',
    amount: 49.99,
    originalPrice: 89.99,
    discount: 40.0,
    currency: 'USD',
    currencySymbol: '$',
    paymentMethod: 'UPI',
    paymentMethodLabel: 'UPI / VPA (vibhanshu@okaxis)',
    timestamp: '2026-10-20T10:45:00.000Z',
    status: 'Completed',
    customerName: 'Vibhanshu Jain',
    customerEmail: 'vibhanshu@learnsphere.edu'
  },
  {
    id: 'TXN-LS-M9B7X4-3190',
    courseId: 'react-development',
    courseTitle: 'React 19 & Next-Gen Frontend Engineering',
    amount: 59.99,
    originalPrice: 99.99,
    discount: 40.0,
    currency: 'USD',
    currencySymbol: '$',
    paymentMethod: 'Card',
    paymentMethodLabel: 'Debit Card (ending in •••• 4242)',
    timestamp: '2026-10-22T14:15:30.000Z',
    status: 'Completed',
    customerName: 'Vibhanshu Jain',
    customerEmail: 'vibhanshu@learnsphere.edu'
  }
];

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const { enrollCourse } = useCourses();

  const [transactions, setTransactions] = useState(() => {
    return getStoredData(STORAGE_KEY_TRANSACTIONS, DEFAULT_TRANSACTIONS);
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Sync to local storage
  useEffect(() => {
    setStoredData(STORAGE_KEY_TRANSACTIONS, transactions);
  }, [transactions]);

  /**
   * Generates a unique dummy transaction ID
   */
  const generateTxnId = () => {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `TXN-LS-${timestampPart}-${randomPart}`;
  };

  /**
   * Simulates end-to-end checkout processing.
   *
   * @param {Object} params
   * @param {Object} params.course - Course object to purchase.
   * @param {string} params.method - 'UPI' | 'Card' | 'NetBanking' | 'Wallet'.
   * @param {string} params.methodLabel - Human readable payment method label.
   * @param {number} params.finalAmount - Payable amount.
   * @param {string} [params.simulateOutcome] - 'success' | 'failure'.
   * @param {Object} [params.customer] - Customer name & email.
   * @returns {Promise<{ success: boolean, receipt: Object, error?: string }>}
   */
  const processPayment = useCallback(
    async ({
      course,
      items,
      method,
      methodLabel,
      finalAmount,
      simulateOutcome = 'success',
      customer = { name: 'Vibhanshu Jain', email: 'vibhanshu@learnsphere.edu' }
    }) => {
      if (isProcessing) {
        return { success: false, error: 'A transaction is already processing. Please wait.' };
      }

      setIsProcessing(true);
      sound.playClick();

      // Simulate network / bank gateway authorization delay (1500ms)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const txnId = generateTxnId();
      const isSuccess = simulateOutcome !== 'failure';

      const allItems = items && Array.isArray(items) && items.length > 0
        ? items
        : course ? [course] : [];

      const primaryTitle = allItems.length === 1
        ? allItems[0].title
        : allItems.length > 1
        ? `${allItems[0].title} (+${allItems.length - 1} more course${allItems.length > 2 ? 's' : ''})`
        : 'LearnSphere Course Package';

      const combinedIds = allItems.map(c => c.id).join(', ');
      const totalOrig = allItems.reduce((acc, c) => acc + (Number(c.originalPrice || c.price) || 49.99), 0);

      const transactionRecord = {
        id: txnId,
        courseId: combinedIds || 'multi-course',
        courseTitle: primaryTitle,
        items: allItems.map(item => ({ id: item.id, title: item.title, price: item.price })),
        amount: finalAmount || (course?.price || 49.99),
        originalPrice: totalOrig,
        currency: 'USD',
        currencySymbol: '$',
        paymentMethod: method,
        paymentMethodLabel: methodLabel || method,
        timestamp: new Date().toISOString(),
        status: isSuccess ? 'Completed' : 'Failed',
        customerName: customer.name,
        customerEmail: customer.email,
        errorMessage: isSuccess ? null : 'Demo transaction declined: Simulated bank authorization failure.'
      };

      // Add to transaction history
      setTransactions((prev) => [transactionRecord, ...prev]);
      setIsProcessing(false);

      if (isSuccess) {
        sound.playSuccess();
        // Immediately enroll user into all purchased courses
        allItems.forEach(item => {
          if (item && item.id) {
            enrollCourse(item.id);
          }
        });

        return {
          success: true,
          receipt: transactionRecord,
          enrolledCourses: allItems
        };
      } else {
        return {
          success: false,
          error: transactionRecord.errorMessage,
          receipt: transactionRecord
        };
      }
    },
    [isProcessing, enrollCourse]
  );

  /**
   * Records a user-cancelled payment attempt
   */
  const recordCancellation = useCallback(
    ({ course, method, finalAmount }) => {
      const cancelledRecord = {
        id: generateTxnId(),
        courseId: course.id,
        courseTitle: course.title,
        amount: finalAmount || course.price || 49.99,
        currency: 'USD',
        currencySymbol: '$',
        paymentMethod: method || 'Unknown',
        paymentMethodLabel: `${method || 'Demo'} (Cancelled)`,
        timestamp: new Date().toISOString(),
        status: 'Cancelled',
        customerName: 'Vibhanshu Jain',
        customerEmail: 'vibhanshu@learnsphere.edu'
      };
      setTransactions((prev) => [cancelledRecord, ...prev]);
      return cancelledRecord;
    },
    []
  );

  return (
    <PaymentContext.Provider
      value={{
        transactions,
        isProcessing,
        processPayment,
        recordCancellation
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
