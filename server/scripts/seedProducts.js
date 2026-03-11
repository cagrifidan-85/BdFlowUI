require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('../models/Product');
const connectDB = require('../config/db');

// Mevcut ürünleriniz (Products component'inden)
const seedProducts = [
    {
        productNo: "1",
        name: "Basınç Sensörü A",
        nameEn: "Pressure Sensor A",
        category: "Pressure Sensors",
        image: "/images/1.png",
        measurementRange: "-1 ... 60 bar",
        description: "Kompakt, genel amaçlı basınç sensörü.",
        descriptionEn: "Compact, general-purpose pressure sensor.",
        price: {
            amount: 1200,
            currency: "TL"
        },
        sensor: "Sensor1",
        connectionType: "Type1",
        properties: "Property1",
        electronics: "Standard1",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Level",
        environment: "Gas",
        stock: 15
    },
    {
        productNo: "2",
        name: "Seviye Sensörü B",
        nameEn: "Level Sensor B",
        category: "Level Sensors",
        image: "/images/2.png",
        measurementRange: "0 ... 15 m",
        description: "Sıvı ve katıların temassız seviye ölçümü için radar sensörü.",
        descriptionEn: "Radar sensor for non-contact level measurement of liquids and solids.",
        price: {
            amount: 2500,
            currency: "TL"
        },
        sensor: "Sensor2",
        connectionType: "Type2",
        properties: "Property2",
        electronics: "Standard2",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Limit",
        environment: "Liquid",
        stock: 8
    },
    {
        productNo: "3",
        name: "Seviye Anahtarı C",
        nameEn: "Level Switch C",
        category: "Level Sensors",
        image: "/images/3.png",
        measurementRange: "Limit seviye",
        description: "Sıvı ve katıların limit seviye tespiti için kapasitif anahtar.",
        descriptionEn: "Capacitive switch for detecting limit levels of liquids and solids.",
        price: {
            amount: 900,
            currency: "TL"
        },
        sensor: "Sensor1",
        connectionType: "Type3",
        properties: "Property3",
        electronics: "Standard1",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Pressure",
        environment: "Gas",
        stock: 12
    },
    {
        productNo: "4",
        name: "Mikrodalga Sensör D",
        nameEn: "Microwave Sensor D",
        category: "Microwave Level Sensors",
        image: "/images/4.png",
        measurementRange: "0 ... 75 m",
        description: "Sıvı ve dökme katıların sürekli seviye ölçümü için.",
        descriptionEn: "Continuous level measurement for liquids and bulk solids.",
        price: {
            amount: 3200,
            currency: "TL"
        },
        sensor: "Sensor3",
        connectionType: "Type1",
        properties: "Property1",
        electronics: "Standard3",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Intensity",
        environment: "Liquid",
        stock: 10
    },
    {
        productNo: "5",
        name: "Radar Sensör E",
        nameEn: "Radar Sensor E",
        category: "Radar Level Sensors",
        image: "/images/5.png",
        measurementRange: "0 ... 75 m",
        description: "Sıvı ve katıların hassas seviye ölçümü için kılavuzlu radar sensörü.",
        descriptionEn: "Guided radar sensor for precise level measurement of liquids and solids.",
        price: {
            amount: 4100,
            currency: "TL"
        },
        sensor: "Sensor2",
        connectionType: "Type2",
        properties: "Property2",
        electronics: "Standard2",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "MassFlow",
        environment: "Gas",
        stock: 7
    },
    {
        productNo: "6",
        name: "Basınç Sensörü F",
        nameEn: "Pressure Sensor F",
        category: "Pressure Sensors",
        image: "/images/1.png",
        measurementRange: "0 ... 100 bar",
        description: "Yüksek basınç ölçümleri için endüstriyel sensör.",
        descriptionEn: "Industrial sensor for high-pressure measurements.",
        price: {
            amount: 1800,
            currency: "TL"
        },
        sensor: "Sensor1",
        connectionType: "Type2",
        properties: "Property3",
        electronics: "Standard3",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "SeparatorLayer",
        environment: "Liquid",
        stock: 5
    },
    {
        productNo: "7",
        name: "Smart Level Sensor G",
        nameEn: "Smart Level Sensor G",
        category: "Level Sensors",
        image: "/images/2.png",
        measurementRange: "0 ... 30 m",
        description: "Remote monitoring capability with IoT feature.",
        descriptionEn: "Remote monitoring capability with IoT feature.",
        price: {
            amount: 3500,
            currency: "TL"
        },
        sensor: "Sensor3",
        connectionType: "Type3",
        properties: "Property1",
        electronics: "Standard2",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Level",
        environment: "Liquid",
        stock: 6
    },
    {
        productNo: "8",
        name: "Compact Sensor H",
        nameEn: "Compact Sensor H",
        category: "Level Sensors",
        image: "/images/3.png",
        measurementRange: "Limit level",
        description: "Compact design for small spaces.",
        descriptionEn: "Compact design for small spaces.",
        price: {
            amount: 750,
            currency: "TL"
        },
        sensor: "Sensor2",
        connectionType: "Type1",
        properties: "Property2",
        electronics: "Standard1",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Limit",
        environment: "Gas",
        stock: 20
    },
    {
        productNo: "9",
        name: "Industrial Sensor I",
        nameEn: "Industrial Sensor I",
        category: "Microwave Level Sensors",
        image: "/images/4.png",
        measurementRange: "0 ... 100 m",
        description: "Durable for harsh industrial environments.",
        descriptionEn: "Durable for harsh industrial environments.",
        price: {
            amount: 4000,
            currency: "TL"
        },
        sensor: "Sensor1",
        connectionType: "Type3",
        properties: "Property3",
        electronics: "Standard3",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Pressure",
        environment: "Liquid",
        stock: 9
    },
    {
        productNo: "10",
        name: "Yüksek Performans Sensör J",
        nameEn: "High Performance Sensor J",
        category: "Level Sensors",
        image: "/images/5.png",
        measurementRange: "0 ... 150 m",
        description: "Uzun mesafe seviye ölçümleri için yüksek performanslı sensör.",
        descriptionEn: "High-performance sensor for long-distance level measurements.",
        price: {
            amount: 5000,
            currency: "TL"
        },
        sensor: "Sensor2",
        connectionType: "Type2",
        properties: "Property1",
        electronics: "Standard2",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "MassFlow",
        environment: "Gas",
        stock: 7
    },
    {
        productNo: "11",
        name: "Akıllı Basınç Sensörü K",
        nameEn: "Smart Pressure Sensor K",
        category: "Pressure Sensors",
        image: "/images/1.png",
        measurementRange: "0 ... 200 bar",
        description: "Akıllı özelliklerle donatılmış basınç sensörü.",
        descriptionEn: "Pressure sensor equipped with smart features.",
        price: {
            amount: 2200,
            currency: "TL"
        },
        sensor: "Sensor3",
        connectionType: "Type1",
        properties: "Property2",
        electronics: "Standard1",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "SeparatorLayer",
        environment: "Liquid",
        stock: 4
    },
    {
        productNo: "12",
        name: "Seviye Sensörü L",
        nameEn: "Level Sensor L",
        category: "Level Sensors",
        image: "/images/2.png",
        measurementRange: "0 ... 20 m",
        description: "Hassas seviye ölçümleri için yüksek doğruluklu sensör.",
        descriptionEn: "High-accuracy sensor for precise level measurements.",
        price: {
            amount: 2700,
            currency: "TL"
        },
        sensor: "Sensor1",
        connectionType: "Type2",
        properties: "Property3",
        electronics: "Standard3",
        catalogUrl: "https://pdfobject.com/pdf/sample.pdf",
        material: "Level",
        environment: "Gas",
        stock: 3
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        
        // Önce mevcut verileri temizle
        await Product.deleteMany({});
        console.log('Existing products cleared');
        
        // Yeni verileri ekle
        await Product.insertMany(seedProducts);
        console.log(`${seedProducts.length} products added successfully!`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
