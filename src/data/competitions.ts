export interface Competition {
    image: string;
    title: string;
    subtitle: string;
    location: string;
    handle: string;
    description: string;
    borderColor: string;
    gradient: string;
    url: string;
    isFlagship?: boolean;
    prizePool?: string;
    isExhibition?: boolean;
}

export const COMPETITIONS_DATA: Competition[] = [
    // Flagships
    {
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'Codex ’26',
        subtitle: '24-Hour Hackathon',
        location: 'Flagship Event',
        handle: 'Codex-Hack',
        description: 'The premier hackathon of Nirmaan. 24 hours of pure product development, intense coding, and transformative innovation. Build the future and claim the throne.',
        borderColor: '#5227FF',
        gradient: 'linear-gradient(145deg, #5227FF, #000)',
        url: '#',
        isFlagship: true,
        prizePool: '₹1,00,000+'
    },
    {
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'Robotics Arena ’26',
        subtitle: 'The Mecha Combat',
        location: 'Flagship Event',
        handle: 'Robo-Arena',
        description: 'Witness high-octane robotic combat. Design, build, and optimize your machines to survive the definitive battlefield of metal and electronics.',
        borderColor: '#d9ff00',
        gradient: 'linear-gradient(180deg, #d9ff00, #000)',
        url: '#',
        isFlagship: true,
        prizePool: '₹1,00,000+'
    },
    // Standard Competitions
    {
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'Battle-Grid ’26',
        subtitle: 'One Arena, One Champion',
        location: 'Gaming & Combat',
        handle: 'Grid-Warrior',
        description: 'The ultimate tactical arena battle. A high-stakes competition where only one warrior will emerge as the absolute champion of the grid.',
        borderColor: '#ff4655',
        gradient: 'linear-gradient(210deg, #ff4655, #000)',
        url: '#',
        prizePool: '₹20,000+'
    },
    {
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'UI/UX Challenge',
        subtitle: 'Product-Based Design',
        location: 'Design & Product',
        handle: 'Nexus-Design',
        description: 'Solve real-world product problems through design. Craft seamless user experiences and intuitive interfaces for the modern digital era.',
        borderColor: '#5227FF',
        gradient: 'linear-gradient(145deg, #5227FF, #000)',
        url: '#',
        prizePool: '₹15,000+'
    },
    {
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'Bug Bounty',
        subtitle: 'Debugging Marathon',
        location: 'Software Engineering',
        handle: 'Bug-Slayer',
        description: 'A race against the clock to hunt, identify, and fix complex software vulnerabilities. Prove your mastery over code and logic.',
        borderColor: '#d9ff00',
        gradient: 'linear-gradient(195deg, #d9ff00, #000)',
        url: '#',
        prizePool: '₹10,000+'
    },
    {
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'Code Cooking',
        subtitle: 'Competitive Programming',
        location: 'Algorithm Arena',
        handle: 'Logic-Chef',
        description: 'Boil down complex problems into efficient algorithms. Prepare the perfect solution using the leanest logic in this high-intensity coding duel.',
        borderColor: '#5227FF',
        gradient: 'linear-gradient(165deg, #5227FF, #000)',
        url: '#',
        prizePool: '₹10,000+'
    },
    {
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'Prompt Engineering',
        subtitle: 'AI Arena',
        location: 'Artificial Intelligence',
        handle: 'Prompt-Lord',
        description: 'The art of communicating with machines. Master the LLMs and generate the most accurate, creative, and efficient outputs through precise prompting.',
        borderColor: '#d9ff00',
        gradient: 'linear-gradient(135deg, #d9ff00, #000)',
        url: '#',
        prizePool: '₹10,000+'
    },
    // Exhibition
    {
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&h=400&auto=format&fit=crop',
        title: 'AI Art Gallery',
        subtitle: 'Exhibition & Showcase',
        location: 'Branding Initiative',
        handle: 'AI-Gallery',
        description: 'Explore the intersection of machine learning and fine arts. A non-competitive showcase of revolutionary AI-generated masterpieces created specifically for Nirmaan ’26.',
        borderColor: '#5227FF',
        gradient: 'linear-gradient(145deg, #5227FF, #000)',
        url: '#',
        isExhibition: true
    }
];
