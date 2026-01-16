const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const { Filters } = require('../models/Product');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected:', conn.connection.host);
        return conn;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

const seedFilters = async () => {
    await connectDB();

    try {
        // Delete existing filters data
        await Filters.deleteMany({});
        console.log('Existing filters deleted');

        // Insert new filters data
        const filtersData = {
            sensors: [
                { code: 'pressure', en: 'Pressure', tr: 'Basınç' },
                { code: 'level', en: 'Level', tr: 'Seviye' },
                { code: 'flow', en: 'Flow', tr: 'Akış' },
                { code: 'temperature', en: 'Temperature', tr: 'Sıcaklık' }
            ],
            connectionTypes: [
                { code: '4-20ma', en: '4-20mA', tr: '4-20mA' },
                { code: '0-10v', en: '0-10V', tr: '0-10V' },
                { code: 'hart', en: 'HART', tr: 'HART' },
                { code: 'rs485', en: 'RS485', tr: 'RS485' },
                { code: 'wireless', en: 'Wireless', tr: 'Kablosuz' }
            ],
            properties: [
                { code: 'analog_output', en: 'Analog Output', tr: 'Analog Çıkış' },
                { code: 'digital_output', en: 'Digital Output', tr: 'Dijital Çıkış' },
                { code: 'pulse_output', en: 'Pulse Output', tr: 'Darbe Çıkışı' },
                { code: '4wire', en: '4-Wire', tr: '4-Telli' },
                { code: '2wire', en: '2-Wire', tr: '2-Telli' }
            ],
            electronics: [
                { code: 'standard', en: 'Standard', tr: 'Standart' },
                { code: 'intrinsically_safe', en: 'Intrinsically Safe', tr: 'İçsel Güvenli' },
                { code: 'explosion_proof', en: 'Explosion Proof', tr: 'Patlamaya Dayanıklı' },
                { code: 'smart', en: 'Smart', tr: 'Akıllı' }
            ],
            categories: [
                { code: 'pressure_sensor', en: 'Pressure Sensor', tr: 'Basınç Sensörü' },
                { code: 'level_sensor', en: 'Level Sensor', tr: 'Seviye Sensörü' },
                { code: 'flow_meter', en: 'Flow Meter', tr: 'Akış Ölçer' },
                { code: 'temperature_sensor', en: 'Temperature Sensor', tr: 'Sıcaklık Sensörü' },
                { code: 'transmitter', en: 'Transmitter', tr: 'Verici' },
                { code: 'controller', en: 'Controller', tr: 'Kontrolör' }
            ],
            materials: [
                { code: 'stainless_steel', en: 'Stainless Steel', tr: 'Paslanmaz Çelik' },
                { code: 'carbon_steel', en: 'Carbon Steel', tr: 'Karbon Çelik' },
                { code: 'aluminum', en: 'Aluminum', tr: 'Alüminyum' },
                { code: 'plastic', en: 'Plastic', tr: 'Plastik' },
                { code: 'brass', en: 'Brass', tr: 'Pirinç' }
            ],
            environments: [
                { code: 'gas', en: 'Gas', tr: 'Gaz' },
                { code: 'liquid', en: 'Liquid', tr: 'Sıvı' },
                { code: 'solid', en: 'Solid', tr: 'Katı' },
                { code: 'powder', en: 'Powder', tr: 'Toz' }
            ]
        };

        await Filters.create(filtersData);
        console.log('Filters data seeded successfully!');
    } catch (err) {
        console.error('Error seeding filters:', err.message);
    }

    process.exit();
};

seedFilters();
