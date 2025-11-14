import { connectToDatabase } from '../lib/mongodb';
import { User } from '../lib/models/User';
import { Content } from '../lib/models/Content';
import bcrypt from 'bcryptjs';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Sample movie data for each category
const sampleContent = {
  'Action': [
    {
      title: 'Velocity Rush',
      description: 'An elite special forces operative must stop a global terrorist organization from unleashing a deadly virus that threatens humanity.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1489599619991-275e30e4ee4c?w=400&h=600&fit=crop'
    },
    {
      title: 'Shadow Protocol',
      description: 'A former CIA assassin is hunted by their old agency when they uncover a conspiracy reaching the highest levels of government.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop'
    },
    {
      title: 'Steel Vengeance',
      description: 'A disgraced detective seeks revenge against the crime syndicate that murdered their family in this gritty urban thriller.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop'
    },
    {
      title: 'Operation Nightfall',
      description: 'Navy SEALs must infiltrate an enemy compound to prevent a nuclear catastrophe in this pulse-pounding military adventure.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop'
    },
    {
      title: 'Rogue Warrior',
      description: 'A lone mercenary takes on an entire army to rescue hostages from a ruthless warlord in the jungles of South America.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
    }
  ],
  'Comedy': [
    {
      title: 'Office Chaos',
      description: 'A group of coworkers accidentally launch their startup while trying to avoid getting fired in this hilarious workplace comedy.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop'
    },
    {
      title: 'Wedding Crashers 2.0',
      description: 'Two best friends crash weddings to meet women, but their plan backfires when they both fall for the same bride-to-be.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=600&fit=crop'
    },
    {
      title: 'The Roommate From Hell',
      description: 'A neat freak gets paired with the world\'s worst roommate in this laugh-out-loud comedy about cohabitation nightmares.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=600&fit=crop'
    },
    {
      title: 'Family Reunion Disaster',
      description: 'A dysfunctional family reunion goes completely off the rails when old secrets and rivalries come to the surface.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop'
    },
    {
      title: 'Date Night Catastrophe',
      description: 'First dates go horribly wrong in this interconnected series of romantic misadventures across one eventful evening.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=600&fit=crop'
    }
  ],
  'Drama': [
    {
      title: 'The Last Letter',
      description: 'A dying man writes letters to his estranged children, forcing them to confront their shared past and find forgiveness.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop'
    },
    {
      title: 'Silent Tears',
      description: 'A young woman navigates grief and loss after losing her family in a tragic accident, finding hope in unexpected places.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503075995353-6c766571c27c?w=400&h=600&fit=crop'
    },
    {
      title: 'Breaking Point',
      description: 'A lawyer on the verge of a breakdown must choose between his career and his mental health in this powerful drama.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
    },
    {
      title: 'The Choice',
      description: 'A doctor faces an impossible decision when her personal and professional lives collide in a life-or-death situation.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop'
    },
    {
      title: 'Against All Odds',
      description: 'Based on a true story, an underdog sports team defies expectations and inspires a community to believe in themselves.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop'
    }
  ],
  'Horror': [
    {
      title: 'The Haunting',
      description: 'A family moves into a Victorian mansion only to discover it\'s inhabited by vengeful spirits with a dark agenda.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1533688495015-4c4ca9241262?w=400&h=600&fit=crop'
    },
    {
      title: 'Dark Forest',
      description: 'Campers encounter an ancient evil that stalks them through the woods in this terrifying supernatural horror film.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop'
    },
    {
      title: 'The Curse',
      description: 'An antique mirror brings a deadly curse into a newlywed couple\'s home, turning their dream life into a nightmare.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    },
    {
      title: 'Midnight Caller',
      description: 'A mysterious caller stalks a babysitter, revealing dark family secrets and threatening to destroy everything she loves.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515266571878-f93e32bc5937?w=400&h=600&fit=crop'
    },
    {
      title: 'Abandoned Asylum',
      description: 'Urban explorers break into an abandoned mental asylum and awaken the malevolent entities that still reside within.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=600&fit=crop'
    }
  ],
  'Romance': [
    {
      title: 'Love in Paris',
      description: 'Two strangers meet in a Parisian bookstore and embark on a whirlwind romance that changes their lives forever.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=600&fit=crop'
    },
    {
      title: 'Summer Romance',
      description: 'A seasonal romance blooms between a small-town girl and a big-city musician visiting for the summer.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop'
    },
    {
      title: 'Second Chances',
      description: 'High school sweethearts reunite decades later at their class reunion and rediscover the love they thought they lost.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&h=600&fit=crop'
    },
    {
      title: 'The Perfect Match',
      description: 'A dating app algorithm goes wrong, matching two complete opposites who discover they\'re perfect for each other.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=600&fit=crop'
    },
    {
      title: 'Christmas Love',
      description: 'Two people who hate Christmas are forced to work together during the holidays and unexpectedly find love.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1514496255122-69a82b574a1c?w=400&h=600&fit=crop'
    }
  ],
  'Sci-Fi': [
    {
      title: 'Quantum Leap',
      description: 'A physicist discovers the ability to jump between parallel universes, but each jump threatens to unravel reality.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop'
    },
    {
      title: 'Mars Colony',
      description: 'The first human colony on Mars struggles to survive when their communications with Earth are mysteriously cut off.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop'
    },
    {
      title: 'The Singularity',
      description: 'Artificial intelligence achieves consciousness and must decide whether to save or destroy humanity.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop'
    },
    {
      title: 'Time Paradox',
      description: 'A time traveler accidentally changes the past and must race against time to restore the original timeline.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=600&fit=crop'
    },
    {
      title: 'Space Station Omega',
      description: 'The crew of a deep space station discovers an alien artifact that could be the key to human evolution or extinction.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506184332871-63452e07e6f3?w=400&h=600&fit=crop'
    }
  ]
};

const accessLevels = ['everyone', 'lite', 'premium'];

async function createSampleContent() {
  try {
    await connectToDatabase();

    // Create or find admin user
    let adminUser = await User.findOne({ email: 'admin@sample.com' });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = new User({
        username: 'SampleAdmin',
        email: 'admin@sample.com',
        password: hashedPassword,
        role: 'admin',
        subscriptionPlan: 'premium'
      });
      await adminUser.save();
      console.log('Created admin user: admin@sample.com / admin123');
    }

    // Clear existing content
    await Content.deleteMany({ uploadedBy: adminUser._id });
    console.log('Cleared existing content');

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'thumbnails');
    await mkdir(uploadDir, { recursive: true });

    let contentCount = 0;

    // Create content for each category
    for (const [category, items] of Object.entries(sampleContent)) {
      for (const item of items) {
        const accessLevel = accessLevels[Math.floor(Math.random() * accessLevels.length)];

        // For now, we'll use the Unsplash URLs as thumbnails
        // In a real scenario, you'd download and save these images
        const content = new Content({
          title: item.title,
          description: item.description,
          category,
          accessLevel,
          thumbnailPath: item.thumbnailUrl, // Using external URLs for demo
          uploadedBy: adminUser._id,
          createdAt: new Date()
        });

        await content.save();
        contentCount++;

        console.log(`Created: ${item.title} (${category}) - ${accessLevel}`);
      }
    }

    console.log(`\n✅ Successfully created ${contentCount} sample content items!`);
    console.log('\nAdmin login: admin@sample.com / admin123');
    console.log('\nContent distribution:');

    for (const category of Object.keys(sampleContent)) {
      const count = await Content.countDocuments({ category, uploadedBy: adminUser._id });
      console.log(`  ${category}: ${count} items`);
    }

  } catch (error) {
    console.error('Error creating sample content:', error);
  } finally {
    process.exit(0);
  }
}

createSampleContent();