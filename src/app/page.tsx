'use client'; // บรรทัดนี้สำคัญมากสำหรับ Next.js เพื่อบอกว่าหน้านี้มีการใช้ state และ event

import { useState } from 'react';

// เราไม่จำเป็นต้องใช้ <Image> จาก next/image ในตัวอย่างนี้แล้ว
// import Image from 'next/image';

// 1. กำหนด "ชนิดข้อมูล" ของสินค้าแต่ละชิ้น (Interface)
// เพื่อให้โค้ดของเราจัดการข้อมูลได้ง่ายและลดข้อผิดพลาด
interface Product {
  id: number;
  name: string;
  price: number;
}

// กำหนด "ชนิดข้อมูล" ของสินค้าในตะกร้า ซึ่งจะมีจำนวน (quantity) เพิ่มเข้ามา
interface CartItem extends Product {
  quantity: number;
}

// 2. สร้างรายการสินค้าทั้งหมดที่มีตามโจทย์
const products: Product[] = [
  { id: 1, name: 'iPhone 16 pro', price: 39900 },
  { id: 2, name: 'iphone 16', price: 29900 },
  { id: 3, name: 'iPhone 16e', price: 26900 },
  { id: 4, name: 'iPad', price: 12900 },
  { id: 5, name: 'iPad Air', price: 21900 },
  { id: 6, name: 'iPad Pro', price: 37900 },
];

// นี่คือคอมโพเนนต์หลักของหน้าเว็บเรา
export default function Home() {
  // 3. สร้าง "State" เพื่อใช้เก็บข้อมูลสินค้าในตะกร้า
  //    - cartItems คือตัวแปรที่เก็บข้อมูล
  //    - setCartItems คือฟังก์ชันสำหรับอัปเดตข้อมูล
  //    - ค่าเริ่มต้นคือ [] (Array ว่าง)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 4. สร้างฟังก์ชันสำหรับจัดการตะกร้าสินค้า
  
  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า (เมื่อกดปุ่ม + หรือ "เพิ่มลงตะกร้า")
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === product.id);
      if (itemInCart) {
        // ถ้ามีสินค้านี้ในตะกร้าแล้ว ให้เพิ่มจำนวน (quantity) ขึ้น 1
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // ถ้ายังไม่มี ให้เพิ่มสินค้าใหม่เข้าไปในตะกร้า โดยกำหนด quantity เป็น 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // ฟังก์ชันลดจำนวนสินค้า (เมื่อกดปุ่ม -)
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === productId);
      // ถ้าเหลือชิ้นเดียวแล้วกดลบอีก จะเป็นการเอาสินค้าออกจากตะกร้าไปเลย
      if (itemInCart?.quantity === 1) {
        return prevItems.filter(item => item.id !== productId);
      } else {
        // ถ้ามีมากกว่า 1 ชิ้น ให้ลดจำนวน (quantity) ลง 1
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };
  
  // ฟังก์ชันล้างตะกร้าสินค้า (เมื่อกดปุ่ม "ล้างตะกร้า")
  const clearCart = () => {
    setCartItems([]);
  };

  // 5. คำนวณค่าสรุปต่างๆ จากข้อมูลใน state
  
  // คำนวณจำนวนสินค้าทั้งหมดในตะกร้า
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // คำนวณราคารวมทั้งหมดของสินค้าในตะกร้า
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // 6. ส่วนที่แสดงผลบนหน้าจอ (UI)
  return (
    <div className="font-sans min-h-screen bg-gray-50 p-4 sm:p-8">
      <main className="max-w-4xl mx-auto">
        {/* ส่วนแสดงรายการสินค้าทั้งหมด */}
        <section>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">รายการสินค้า</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow p-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                  <p className="text-lg text-gray-600 my-2">{product.price.toLocaleString()} บาท</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-10 border-gray-300" />

        {/* ส่วนแสดงตะกร้าสินค้า */}
        <section>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">ตะกร้าสินค้าของคุณ</h1>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีสินค้าในตะกร้า</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">{(item.price * item.quantity).toLocaleString()} บาท</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold text-lg hover:bg-red-600">-</button>
                    <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="bg-green-500 text-white w-8 h-8 rounded-full font-bold text-lg hover:bg-green-600">+</button>
                  </div>
                </div>
              ))}
              
              {/* ส่วนสรุปท้ายตะกร้า */}
              <div className="mt-6 pt-6 border-t border-gray-300 flex flex-col items-end gap-3">
                 <div className="text-xl font-bold text-gray-800">
                    <span>จำนวนรวม: </span>
                    <span>{totalItemsInCart} ชิ้น</span>
                 </div>
                 <div className="text-2xl font-bold text-blue-700">
                    <span>ราคารวมทั้งหมด: </span>
                    <span>{totalPrice.toLocaleString()} บาท</span>
                 </div>
                 <button onClick={clearCart} className="mt-4 bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-colors">
                    ล้างตะกร้า
                 </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}