import { ContactForm } from "@/components/site/contact-form";
import { site } from "@/content/site";
import { contactIsConfigured } from "@/lib/supabase/config";

export function Contact() {
  const { contact } = site;
  const configured = contactIsConfigured();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="shell scroll-mt-24 py-20 md:py-28"
    >
      <div className="rule mb-10 md:mb-14" />

      <div className="grid gap-16 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 id="contact-title" className="display-lg mt-4">
            {contact.headline}
          </h2>
          <p className="body-lg mt-6 max-w-xl">{contact.intro}</p>

          <p className="mt-8 text-sm text-muted">
            {contact.note}{" "}
            <a href={`mailto:${site.email}`} className="link-line text-ivory">
              {site.email}
            </a>
          </p>
        </div>

        <ContactForm configured={configured} />
      </div>
    </section>
  );
}