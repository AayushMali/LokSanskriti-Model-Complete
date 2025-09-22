import React from 'react';
import { Waveform, Languages, Zap, Shield } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: Waveform,
      title: 'High Accuracy',
      description: 'Advanced AI transcription with 95%+ accuracy'
    },
    {
      icon: Languages,
      title: '99+ Languages',
      description: 'Support for multiple languages including Hindi, Marathi'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: '2-5 seconds per minute of audio'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your audio files are processed locally and securely'
    }
  ];

  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform{' '}
              <span className="gradient-text">Audio</span>
              {' '}into{' '}
              <span className="gradient-text">Text</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional audio transcription powered by OpenAI Whisper. 
              Upload your audio files and get accurate transcriptions in seconds.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-3 rounded-xl w-fit mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-3xl font-bold gradient-text mb-2">99+</div>
            <div className="text-gray-600 dark:text-gray-400">Languages Supported</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold gradient-text mb-2">50MB</div>
            <div className="text-gray-600 dark:text-gray-400">Max File Size</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold gradient-text mb-2">95%+</div>
            <div className="text-gray-600 dark:text-gray-400">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;