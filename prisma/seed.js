// ============================================
// Seed Script — Populate sample customer data
// ============================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const customers = [
    {
        accountNumber: 'ACC-10001',
        issueDate: new Date('2024-12-15'),
        interestRate: 8.5,
        tenure: 12,
        monthlyInstallment: 10000.00,
        emiDue: 10000.00,
        totalBalance: 120000.00,
        nextDueDate: new Date('2025-01-15'),
    },
    {
        accountNumber: 'ACC-10002',
        issueDate: new Date('2024-12-20'),
        interestRate: 9.0,
        tenure: 12,
        monthlyInstallment: 15000.00,
        emiDue: 15000.00,
        totalBalance: 180000.00,
        nextDueDate: new Date('2025-01-20'),
    },
    {
        accountNumber: 'ACC-10003',
        issueDate: new Date('2024-12-10'),
        interestRate: 7.5,
        tenure: 12,
        monthlyInstallment: 5000.00,
        emiDue: 5000.00,
        totalBalance: 60000.00,
        nextDueDate: new Date('2025-01-10'),
    },
    {
        accountNumber: 'ACC-10004',
        issueDate: new Date('2024-12-05'),
        interestRate: 10.0,
        tenure: 12,
        monthlyInstallment: 20000.00,
        emiDue: 20000.00,
        totalBalance: 240000.00,
        nextDueDate: new Date('2025-01-05'),
    },
    {
        accountNumber: 'ACC-10005',
        issueDate: new Date('2024-12-01'),
        interestRate: 8.0,
        tenure: 12,
        monthlyInstallment: 12000.00,
        emiDue: 12000.00,
        totalBalance: 144000.00,
        nextDueDate: new Date('2025-01-01'),
    },
];

async function main() {
    // eslint-disable-next-line no-console
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.payment.deleteMany();
    await prisma.customer.deleteMany();

    // Create fresh customers
    await prisma.customer.createMany({
        data: customers,
        skipDuplicates: true,
    });

    // eslint-disable-next-line no-console
    console.log(`✅ Seeded ${customers.length} customers`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
