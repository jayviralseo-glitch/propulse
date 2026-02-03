import React from "react";
import { Link } from "react-router-dom";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Consultant",
      company: "Tech Solutions Inc.",
      content:
        "This platform has completely transformed how I create proposals. What used to take me 4-5 hours now takes just 30 minutes, and the quality is even better!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Growth Marketing Co.",
      content:
        "The AI-generated proposals are incredibly professional and tailored. Our client approval rate has increased from 60% to 85% since we started using this tool.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Business Development",
      company: "Innovation Labs",
      content:
        "I love how easy it is to customize proposals for different clients. The templates are excellent starting points, and the AI suggestions are spot-on.",
      rating: 5,
      avatar: "ER",
    },
    {
      name: "David Thompson",
      role: "Sales Manager",
      company: "Enterprise Solutions",
      content:
        "This tool has been a game-changer for our sales team. We're closing deals faster and our proposals look more professional than ever before.",
      rating: 5,
      avatar: "DT",
    },
    {
      name: "Lisa Wang",
      role: "Independent Contractor",
      company: "Creative Services",
      content:
        "As a solo contractor, I needed a way to compete with larger agencies. This platform gives me the same professional proposal quality at a fraction of the cost.",
      rating: 5,
      avatar: "LW",
    },
    {
      name: "Robert Kim",
      role: "Project Manager",
      company: "Digital Innovations",
      content:
        "The time savings alone make this worth it, but the quality improvement is what really impresses our clients. Highly recommended!",
      rating: 5,
      avatar: "RK",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied professionals who have transformed their
            proposal process and are winning more deals than ever before.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card animate-optimized bg-white rounded-2xl p-6 shadow-medium hover:shadow-hover transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-blue-500 opacity-50" />
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                50,000+
              </div>
              <div className="text-gray-600">Proposals Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                4.9/5
              </div>
              <div className="text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Success Stories
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating winning proposals today and become part of our
              growing community of successful professionals.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-medium hover:shadow-hover"
            >
              Start Your Success Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
