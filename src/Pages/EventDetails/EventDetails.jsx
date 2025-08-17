import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Calendar, Clock, MapPin, ArrowLeft, Users, Tag, Video } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would be fetched from an API
  const mockEvents = {
    1: {
      id: 1,
      title: 'React 19 Deep Dive',
      date: '2025-08-25T15:00:00',
      description: 'Join us for an in-depth exploration of the latest features in React 19. This session will cover concurrent rendering, server components, and the new hooks API. Perfect for developers looking to stay ahead of the curve.',
      type: 'webinar',
      speaker: 'Dan Abramov',
      speakerTitle: 'React Core Team',
      speakerBio: 'Co-creator of Redux and Create React App. Currently working on React at Meta.',
      location: 'Online',
      duration: '90 minutes',
      capacity: 500,
      tags: ['React', 'Frontend', 'Web Development'],
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    2: {
      id: 2,
      title: 'State Management in 2025',
      date: '2025-09-10T14:30:00',
      description: 'Exploring modern state management solutions and patterns for large-scale applications. We\'ll compare different approaches and discuss best practices.',
      type: 'workshop',
      speaker: 'Sarah Drasner',
      speakerTitle: 'VP of Developer Experience at Netlify',
      speakerBio: 'Award-winning speaker, author, and developer advocate with a passion for web animations and performance.',
      location: 'San Francisco, CA',
      duration: '2 hours',
      capacity: 50,
      tags: ['State Management', 'Frontend', 'Workshop']
    },
    3: {
      id: 3,
      title: 'Building Scalable Apps',
      date: '2025-09-22T16:00:00',
      description: 'Architecture patterns and best practices for building large-scale, maintainable applications. Learn from real-world case studies and practical examples.',
      type: 'conference',
      speaker: 'Guillermo Rauch',
      speakerTitle: 'CEO of Vercel',
      speakerBio: 'Creator of Next.js, Socket.io, and other popular open-source projects. Passionate about developer experience and web performance.',
      location: 'New York, NY',
      duration: '1 day',
      capacity: 200,
      tags: ['Architecture', 'Scalability', 'Best Practices']
    }
  };

  useEffect(() => {
    // Simulate API fetch
    const fetchEvent = () => {
      setLoading(true);
      // In a real app, you would fetch from an API:
      // const response = await fetch(`/api/events/${id}`);
      // const data = await response.json();
      // setEvent(data);
      
      // For now, using mock data
      setTimeout(() => {
        setEvent(mockEvents[id] || null);
        setLoading(false);
      }, 500);
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Header with back button */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to events
            </Link>
          </div>

          {/* Event content */}
          <div className="md:flex">
            {/* Main content */}
            <div className="p-6 md:p-8 md:flex-1">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-100">
                  {event.type}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {event.title}
              </h1>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
                <span className="flex items-center mr-4">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {formattedDate}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {formattedTime} • {event.duration}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-8">
                <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
              
              <div className="prose dark:prose-invert max-w-none mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Event</h3>
                <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About the Speaker</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">{event.speaker}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.speakerTitle}</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{event.speakerBio}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-600">
              <div className="sticky top-6">
                {event.image && (
                  <div className="mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">When</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formattedDate}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formattedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Where</span>
                    <p className="text-sm text-gray-900 dark:text-white text-right">
                      {event.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Duration</span>
                    <p className="text-sm text-gray-900 dark:text-white">{event.duration}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Capacity</span>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1.5" />
                      <span className="text-sm text-gray-900 dark:text-white">{event.capacity} attendees</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-600">
                    <button className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      <Video className="w-5 h-5 mr-2" />
                      Register Now
                    </button>
                    
                    <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                      By registering, you agree to our terms of service and privacy policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;