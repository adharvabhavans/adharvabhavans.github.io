export default function Schedule() {
  return (
    <section id="schedule" className="py-12 md:py-20 px-4 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-center">
          Event Schedule
        </h2>
        <div className="space-y-4">
          {/* Schedule Items */}
          <div className="card-orbit bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <h3 className="font-bold">6:00 AM</h3>
                <p className="text-sm opacity-90">Volunteer Reporting</p>
              </div>
            </div>
          </div>
          <div className="card-orbit bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center">
                <i className="fas fa-microphone"></i>
              </div>
              <div>
                <h3 className="font-bold">8:00–9:30 AM</h3>
                <p className="text-sm opacity-90">Inauguration Function</p>
              </div>
            </div>
          </div>
          <div className="card-orbit bg-gray-900 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div>
                <h3 className="font-bold">7:30 AM</h3>
                <p className="text-sm opacity-90">School Registration</p>
              </div>
            </div>
          </div>
          {/* Add more schedule items as needed */}
        </div>
      </div>
    </section>
  );
} 