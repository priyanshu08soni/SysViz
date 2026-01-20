import React from 'react';
import { Layers, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-white/5 bg-[#050505] relative z-10 pt-20 pb-10 px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">

                {/* Brand Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Layers size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">SysViz</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed max-w-xs">
                        The advanced platform for visualizing, simulating, and scaling complex system architectures in real-time.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                        <SocialLink icon={<Github size={18} />} href="https://github.com" />
                        <SocialLink icon={<Twitter size={18} />} href="https://twitter.com" />
                        <SocialLink icon={<Linkedin size={18} />} href="https://linkedin.com" />
                        <SocialLink icon={<Mail size={18} />} href="mailto:hello@sysviz.dev" />
                    </div>
                </div>

                {/* Links Sections */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product</h4>
                    <ul className="space-y-3">
                        <FooterLink to="/features">Features</FooterLink>
                        <FooterLink to="/templates">Templates</FooterLink>
                        <FooterLink to="/integrations">Integrations</FooterLink>
                        <FooterLink to="/changelog">Changelog</FooterLink>
                        <FooterLink to="/pricing">Pricing</FooterLink>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resources</h4>
                    <ul className="space-y-3">
                        <FooterLink to="/docs">Documentation</FooterLink>
                        <FooterLink to="/api">API Reference</FooterLink>
                        <FooterLink to="/community">Community</FooterLink>
                        <FooterLink to="/blog">Blog</FooterLink>
                        <FooterLink to="/help">Help Center</FooterLink>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
                    <ul className="space-y-3">
                        <FooterLink to="/about">About</FooterLink>
                        <FooterLink to="/careers">Careers</FooterLink>
                        <FooterLink to="/legal">Contact</FooterLink>
                        <FooterLink to="/partners">Partners</FooterLink>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h4>
                    <ul className="space-y-3">
                        <FooterLink to="/privacy">Privacy Policy</FooterLink>
                        <FooterLink to="/terms">Terms of Service</FooterLink>
                        <FooterLink to="/security">Security</FooterLink>
                        <FooterLink to="/cookies">Cookie Settings</FooterLink>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted font-medium">
                    © 2026 Advanced Architectures Group. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-muted font-bold uppercase tracking-wider">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink: React.FC<{ icon: React.ReactNode, href: string }> = ({ icon, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-all border border-white/5 hover:border-white/10"
    >
        {icon}
    </a>
);

const FooterLink: React.FC<{ children: React.ReactNode, to: string }> = ({ children, to }) => (
    <li>
        <Link to={to} className="text-sm text-muted hover:text-primary transition-colors font-medium">
            {children}
        </Link>
    </li>
);

export default Footer;
