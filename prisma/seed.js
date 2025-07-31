import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Starting database seeding...');
  
  // Create super admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@gymfinder.com' },
    update: {},
    create: {
      email: 'admin@gymfinder.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'super_admin'
    }
  });

  console.log('✅ Super Admin created:', superAdmin.email);

  // Create some sample gyms for demo
  const gym1 = await prisma.gym.upsert({
    where: { email: 'fitzone@example.com' },
    update: {},
    create: {
      name: 'FitZone Premium',
      email: 'fitzone@example.com',
      password: await bcrypt.hash('gym123', 10),
      gymCode: '123456',
      location: 'Downtown District',
      city: 'New York',
      phone: '+1 (555) 123-4567',
      description: 'Premium fitness facility with state-of-the-art equipment',
      services: JSON.stringify(['Personal Training', 'Group Classes', 'Spa']),
      amenities: JSON.stringify(['Pool', 'Sauna', 'Parking']),
      workingHours: '5:00 AM - 11:00 PM',
      priceRange: '$$$',
      category: 'Premium',
      isActive: true
    }
  });
  
  console.log('✅ Gym 1 created:', gym1.name);

  const gym2 = await prisma.gym.upsert({
    where: { email: 'powerhouse@example.com' },
    update: {},
    create: {
      name: 'PowerHouse Gym',
      email: 'powerhouse@example.com',
      password: await bcrypt.hash('gym123', 10),
      gymCode: '789012',
      location: 'Midtown',
      city: 'New York',
      phone: '+1 (555) 234-5678',
      description: 'Serious gym for serious lifters',
      services: JSON.stringify(['Weight Training', 'Personal Training']),
      amenities: JSON.stringify(['Free Weights', 'Parking']),
      workingHours: '6:00 AM - 10:00 PM',
      priceRange: '$$',
      category: 'Strength',
      isActive: true
    }
  });
  
  console.log('✅ Gym 2 created:', gym2.name);

  // Create some sample members
  const members = await prisma.member.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 111-1111',
        gymId: gym1.id,
        status: 'active'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 222-2222',
        gymId: gym1.id,
        status: 'active'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 (555) 333-3333',
        gymId: gym2.id,
        status: 'pending'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1 (555) 444-4444',
        gymId: gym1.id,
        status: 'pending'
      }
    ]
  });
  
  console.log(`✅ Created ${members.count} sample members`);

  // Create some sample revenue records
  const revenues = await prisma.revenue.createMany({
    data: [
      {
        gymId: gym1.id,
        amount: 2500,
        source: 'subscription',
        date: new Date('2024-01-01')
      },
      {
        gymId: gym1.id,
        amount: 1800,
        source: 'membership',
        date: new Date('2024-01-15')
      },
      {
        gymId: gym2.id,
        amount: 1200,
        source: 'subscription',
        date: new Date('2024-01-10')
      },
      {
        gymId: gym1.id,
        amount: 3200,
        source: 'membership',
        date: new Date('2024-02-01')
      },
      {
        gymId: gym2.id,
        amount: 1500,
        source: 'subscription',
        date: new Date('2024-02-05')
      }
    ]
  });
  
  console.log(`✅ Created ${revenues.count} revenue records`);

  // Create activity logs
  const logs = await prisma.activityLog.createMany({
    data: [
      {
        action: 'CREATE_GYM',
        details: 'Created gym: FitZone Premium',
        userType: 'admin',
        userId: superAdmin.id,
        gymId: gym1.id
      },
      {
        action: 'CREATE_GYM',
        details: 'Created gym: PowerHouse Gym',
        userType: 'admin',
        userId: superAdmin.id,
        gymId: gym2.id
      },
      {
        action: 'MEMBER_SIGNUP',
        details: 'New member registered: John Doe',
        userType: 'member',
        userId: 'member_1',
        gymId: gym1.id
      },
      {
        action: 'MEMBER_SIGNUP',
        details: 'New member registered: Mike Johnson',
        userType: 'member',
        userId: 'member_3',
        gymId: gym2.id
      }
    ]
  });
  
  console.log(`✅ Created ${logs.count} activity logs`);
  
  // Create sample subscription plans
  const subscriptions = await prisma.subscription.createMany({
    data: [
      {
        gymId: gym1.id,
        planName: 'Basic Plan',
        price: 29.99,
        duration: 1,
        features: JSON.stringify(['Gym Access', 'Locker Room', 'Basic Equipment']),
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        gymId: gym1.id,
        planName: 'Premium Plan',
        price: 59.99,
        duration: 1,
        features: JSON.stringify(['All Basic Features', 'Group Classes', 'Personal Training', 'Nutrition Consultation']),
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        gymId: gym2.id,
        planName: 'Strength Plan',
        price: 39.99,
        duration: 1,
        features: JSON.stringify(['Weight Training', 'Personal Training', 'Nutrition Guidance']),
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ]
  });
  
  console.log(`✅ Created ${subscriptions.count} subscription plans`);

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - 1 Super Admin created`);
  console.log(`   - 2 Gyms created`);
  console.log(`   - ${members.count} Members created`);
  console.log(`   - ${revenues.count} Revenue records created`);
  console.log(`   - ${logs.count} Activity logs created`);
  console.log(`   - ${subscriptions.count} Subscription plans created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });