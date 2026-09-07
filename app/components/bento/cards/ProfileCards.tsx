"use client";
import Image from "next/image";
import { FiUser, FiTrendingUp, FiBookOpen, FiDownload } from "react-icons/fi";
import { useProfile } from "../../../hooks/useProfile";
import { useActiveCv } from "../../../hooks/useActiveCv";
import api from "@/lib/axios";
import TerminalText from "../../TerminalText";
import aiubLogo from "../../../images/aiub.png";
import swajanDP from "../../../images/swajan_1.jpg";
import { CardHeader, CardBody, Skeleton } from "./primitives";

export function IntroCard() {
  const { profile } = useProfile();

  return (
    <CardBody className="justify-center items-center text-center min-h-[280px]">
      <span className="eyebrow mb-3">{profile?.title || "Full Stack Developer"}</span>
      <h1 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold text-white leading-[1.1] tracking-tight mb-2">
        Hi, I&apos;m {profile?.name || "Swajan Barua"}
      </h1>
      <p className="text-accent-light font-medium text-sm sm:text-base mb-4">
        {profile?.subtitle || "NestJS • Next.js • FastAPI"}
      </p>

      <div className="text-white/65">
        <TerminalText />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center w-full">
        <a href="#projects" className="btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
          View Projects
        </a>
        <a href="#contact" className="btn-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
          Contact Me
        </a>
      </div>
    </CardBody>
  );
}

export function PhotoCard() {
  return (
    <div className="relative h-full min-h-[280px]">
      <Image
        src={swajanDP}
        alt="Swajan Barua"
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
        placeholder="blur"
      />
    </div>
  );
}

export function AboutCard() {
  const { profile, loading } = useProfile();

  return (
    <CardBody className="justify-center">
      <CardHeader icon={<FiUser />} title="Who I Am" />
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[78%]" />
        </div>
      ) : (
        <p className="text-white/80 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {profile?.bio ||
            "I am a Computer Science student and Backend Developer passionate about creating high-performing, scalable systems."}
        </p>
      )}
    </CardBody>
  );
}

export function StatsCard() {
  const { profile, loading } = useProfile();
  const stats = profile?.stats ?? [];

  return (
    <CardBody>
      <CardHeader icon={<FiTrendingUp />} title="Stats" />
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-xl font-bold text-accent-light leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-white/70 font-medium text-[11px] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </CardBody>
  );
}

export function EducationCard() {
  const { profile, loading } = useProfile();

  return (
    <CardBody>
      <CardHeader icon={<FiBookOpen />} title="Education" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {loading ? (
            <>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-28" />
            </>
          ) : (
            <>
              <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                {profile?.education_info?.degree || "BSc in Computer Science"}
              </h4>
              <p className="text-white/70 font-medium text-sm mt-1.5 whitespace-pre-wrap">
                {profile?.education_info?.institution || ""}
              </p>
            </>
          )}
        </div>
        <div className="card-inset p-2.5 h-14 w-14 flex items-center justify-center shrink-0 rounded-2xl">
          <Image src={aiubLogo} alt="AIUB" width={56} height={56} className="w-full h-full object-contain" />
        </div>
      </div>
    </CardBody>
  );
}

export function ResumeCard() {
  const cvUrl = useActiveCv();

  const handleDownload = async () => {
    try {
      await api.post("/track/downloads");
    } catch (err) {
      // Tracking is best-effort; never block the actual download.
      console.error("Download tracking failed:", err);
    }
  };

  return (
    <CardBody className="justify-between">
      <CardHeader icon={<FiDownload />} title="Resume" />
      <p className="text-white/70 text-sm font-medium mb-5">
        Full breakdown of my experience, education and stack.
      </p>
      {cvUrl ? (
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          onClick={handleDownload}
          className="btn-primary w-full mt-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <FiDownload aria-hidden="true" /> Download CV
        </a>
      ) : (
        <button disabled className="btn-secondary w-full mt-auto opacity-50 cursor-not-allowed">
          <FiDownload aria-hidden="true" /> Unavailable
        </button>
      )}
    </CardBody>
  );
}
