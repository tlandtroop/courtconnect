import prisma from './lib/prisma.ts';
async function testDatabase() {
  try {
    // Test query: Fetch all users
    const users = await prisma.user.findMany();
    console.log('Users:', users);

    // Test query: Create a new user
    const newUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    console.log('New User:', newUser);

    // Test query: Fetch the newly created user
    const fetchedUser = await prisma.user.findUnique({
      where: { id: newUser.id },
    });
    console.log('Fetched User:', fetchedUser);
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();