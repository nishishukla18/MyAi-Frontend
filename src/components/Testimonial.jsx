import { Quote, Star } from "lucide-react";

export default function Testimonial() {
    return (
        <div className="text-center bg-gray-50 ">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">What Our Students Say</h1>
            <p className="text-sm md:text-base text-gray-500 mt-4">Join thousands of successful students who transformed their careers with us</p>
            <div className="flex flex-wrap justify-center gap-5 mt-16 text-left">
                <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-white">
                    <Quote className="w-11 h-10 text-purple-800" />
                    <div className="flex items-center justify-center mt-3 gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ))}
                    </div>
                    <p className="text-sm mt-3 text-gray-500">I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.</p>
                    <div className="flex items-center gap-3 mt-4">
                        <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100" alt="userImage1" />
                        <div>
                            <h2 className="text-lg text-gray-900 font-medium">Donald Jackman</h2>
                            <p className="text-sm text-gray-500">SWE 1 @ Amazon</p>
                        </div>
                    </div>
                </div>
        
                <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-white">
                    <Quote className="w-11 h-10 text-purple-800" />
                    <div className="flex items-center justify-center mt-3 gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ))}
                    </div>
                    <p className="text-sm mt-3 text-gray-500">I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.</p>
                    <div className="flex items-center gap-3 mt-4">
                        <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" alt="userImage2" />
                        <div>
                            <h2 className="text-lg text-gray-900 font-medium">Richard Nelson</h2>
                            <p className="text-sm text-gray-500">SWE 2 @ Amazon</p>
                        </div>
                    </div>
                </div>
        
                <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-white">
                    <Quote className="w-11 h-10 text-purple-800" />
                    <div className="flex items-center justify-center mt-3 gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                        ))}
                    </div>
                    <p className="text-sm mt-3 text-gray-500">I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.</p>
                    <div className="flex items-center gap-3 mt-4">
                        <img className="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop" alt="userImage3" />
                        <div>
                            <h2 className="text-lg text-gray-900 font-medium">James Washington</h2>
                            <p className="text-sm text-gray-500">SWE 2 @ Google</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}