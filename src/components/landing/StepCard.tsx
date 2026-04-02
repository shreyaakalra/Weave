import { motion } from "framer-motion";

interface StepProps {
  number: string;
  icon: string;
  title: string;
  desc: string;
  delay: number;
}

export function StepCard({ number, icon, title, desc, delay }: StepProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative group p-8 rounded-[28px] border border-weave-100/10 bg-weave-100/5 hover:bg-weave-100/10 transition-colors"
    >
      <span className="absolute top-4 right-6 text-6xl font-black text-weave-100/5 group-hover:text-weave-100/10 transition-colors">
        {number}
      </span>
      <div className="w-14 h-14 bg-weave-100 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl group-hover:rotate-6 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-weave-100/60 font-light leading-relaxed">{desc}</p>
    </motion.div>
  );
}