import { motion } from "framer-motion";

export default function Testimonials() {
  const cards = [
    {
      quote: "I'd been in Delhi for two years and had zero friends outside work. Within a month of Weave, I met people I actually enjoy spending time with.",
      name: "Arjun R.",
      role: "Software Engineer · Delhi",
      color: "bg-[#4a90d9]"
    },
    {
      quote: "I’m not great at starting conversations, so most apps didn’t work for me. On Weave, it felt easier - I met someone who talks exactly like I do.",
      name: "Karan M.",
      role: "Data Analyst · Mumbai",
      color: "bg-[#4a90d9]"
    },   
    {
      quote: "I wasn’t looking for anything big, just someone to share time with. Somehow it turned into something I genuinely look forward to.",
      name: "Ananya P.",
      role: "Architect · Pune",
      color: "bg-[#4a90d9]"
    },  
  ];

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">
      <p className="uppercase text-xl tracking-[2px] text-[#F7F4D5]/60 mb-4">
        Stories
      </p>

      <h2 className="font-serif text-6xl md:text-7xl font-bold leading-none mb-16">
        Real connections.{" "}
        <span className="italic font-light text-[#F7F4D5]/70">
          Real people.
        </span>
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8 }}
            className="bg-[#165C40]/20 border border-[#F7F4D5]/10 rounded-3xl p-8"
          >
            <p className="font-serif italic text-2xl leading-tight mb-8">
              “{t.quote}”
            </p>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${t.color} text-white rounded-2xl flex items-center justify-center font-bold`}>
                {t.name.slice(0, 2)}
              </div>

              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-[#F7F4D5]/60">
                  {t.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}