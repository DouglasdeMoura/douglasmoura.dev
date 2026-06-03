import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";

import type {
  Resume,
  ResumeBasics,
  ResumeEducationEntry,
  ResumeProjectEntry,
  ResumeVolunteerEntry,
  ResumeWorkEntry,
} from "./types.js";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const styles = StyleSheet.create({
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletMarker: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  contact: {
    color: "#444444",
    fontSize: 9,
    marginTop: 6,
  },
  entry: {
    marginBottom: 7,
  },
  entryHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryMeta: {
    color: "#555555",
    fontSize: 9,
    marginBottom: 3,
  },
  entrySummary: {
    marginBottom: 3,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
  },
  header: {
    marginBottom: 14,
  },
  label: {
    color: "#444444",
    fontSize: 11,
    lineHeight: 1.3,
    marginTop: 2,
  },
  link: {
    color: "#444444",
    textDecoration: "none",
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    lineHeight: 1.15,
  },
  page: {
    color: "#111111",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.4,
    paddingHorizontal: 48,
    paddingVertical: 42,
  },
  section: {
    marginBottom: 9,
  },
  sectionTitle: {
    borderBottomColor: "#999999",
    borderBottomWidth: 0.75,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 3,
    textTransform: "uppercase",
  },
  skillName: {
    fontFamily: "Helvetica-Bold",
  },
  skillRow: {
    marginBottom: 3,
  },
});

const formatDate = (date?: string): string => {
  if (!date) {
    return "Present";
  }
  const [year, month] = date.split("-");
  if (!month) {
    return year;
  }
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
};

const formatRange = (startDate: string, endDate?: string): string =>
  `${formatDate(startDate)} – ${formatDate(endDate)}`;

const stripProtocol = (url: string): string =>
  url.replace(/^https?:\/\//u, "").replace(/\/$/u, "");

const formatLocation = (basics: ResumeBasics): string | undefined => {
  const { location } = basics;
  if (!location?.city) {
    return;
  }
  const country = location.countryCode
    ? regionNames.of(location.countryCode)
    : undefined;
  return country ? `${location.city}, ${country}` : location.city;
};

/**
 * Sections are atomic by default (`wrap={false}`) so a title is never
 * stranded at a page bottom. Sections taller than a page (Experience)
 * must opt into wrapping.
 */
const Section = ({
  title,
  children,
  wrap = false,
}: {
  title: string;
  children: ReactNode;
  wrap?: boolean;
}) => (
  <View style={styles.section} wrap={wrap}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Bullet = ({ children }: { children: ReactNode }) => (
  <View style={styles.bullet}>
    <Text style={styles.bulletMarker}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const Header = ({ basics }: { basics: ResumeBasics }) => {
  const contactParts: { key: string; node: ReactNode }[] = [];
  const location = formatLocation(basics);
  if (location) {
    contactParts.push({ key: "location", node: location });
  }
  contactParts.push(
    {
      key: "email",
      node: (
        <Link href={`mailto:${basics.email}`} style={styles.link}>
          {basics.email}
        </Link>
      ),
    },
    {
      key: "url",
      node: (
        <Link href={basics.url} style={styles.link}>
          {stripProtocol(basics.url)}
        </Link>
      ),
    }
  );
  for (const profile of basics.profiles ?? []) {
    contactParts.push({
      key: profile.network,
      node: (
        <Link href={profile.url} style={styles.link}>
          {stripProtocol(profile.url)}
        </Link>
      ),
    });
  }

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{basics.name}</Text>
      <Text style={styles.label}>{basics.label}</Text>
      <Text style={styles.contact}>
        {contactParts.map((part, index) => (
          <Text key={part.key}>
            {index > 0 && "  ·  "}
            {part.node}
          </Text>
        ))}
      </Text>
    </View>
  );
};

const WorkItem = ({ entry }: { entry: ResumeWorkEntry }) => (
  <View style={styles.entry} wrap={false}>
    <View style={styles.entryHeader}>
      <Text style={styles.entryTitle}>
        {entry.position} · {entry.name}
      </Text>
      <Text style={styles.entryMeta}>
        {formatRange(entry.startDate, entry.endDate)}
      </Text>
    </View>
    {entry.summary && <Text style={styles.entrySummary}>{entry.summary}</Text>}
    {entry.highlights?.map((highlight) => (
      <Bullet key={highlight}>{highlight}</Bullet>
    ))}
  </View>
);

const VolunteerItem = ({ entry }: { entry: ResumeVolunteerEntry }) => (
  <View style={styles.entry} wrap={false}>
    <View style={styles.entryHeader}>
      <Text style={styles.entryTitle}>
        {entry.position} · {entry.organization}
      </Text>
      <Text style={styles.entryMeta}>
        {formatRange(entry.startDate, entry.endDate)}
      </Text>
    </View>
    {entry.summary && <Text>{entry.summary}</Text>}
  </View>
);

const EducationItem = ({ entry }: { entry: ResumeEducationEntry }) => (
  <View style={styles.entry} wrap={false}>
    <View style={styles.entryHeader}>
      <Text style={styles.entryTitle}>
        {entry.studyType} in {entry.area}
      </Text>
      <Text style={styles.entryMeta}>
        {formatRange(entry.startDate, entry.endDate)}
      </Text>
    </View>
    <Text>{entry.institution}</Text>
  </View>
);

const ProjectItem = ({ entry }: { entry: ResumeProjectEntry }) => (
  <View style={styles.entry} wrap={false}>
    <Text>
      <Text style={styles.entryTitle}>{entry.name}</Text>
      {entry.description && ` — ${entry.description}`}
    </Text>
    {entry.url && (
      <Link href={entry.url} style={styles.link}>
        {stripProtocol(entry.url)}
      </Link>
    )}
  </View>
);

const TalkItem = ({ entry }: { entry: ResumeProjectEntry }) => {
  const meta = [entry.entity, entry.location?.name, formatDate(entry.startDate)]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={styles.entry} wrap={false}>
      <Text style={styles.entryTitle}>{entry.name}</Text>
      <Text style={styles.entryMeta}>{meta}</Text>
    </View>
  );
};

export const ResumeDocument = ({ resume }: { resume: Resume }) => {
  const talks = resume.projects?.filter((p) => p.type === "talk") ?? [];
  const projects = resume.projects?.filter((p) => p.type !== "talk") ?? [];

  return (
    <Document
      author={resume.basics.name}
      subject={resume.basics.label}
      title={`${resume.basics.name} — Resume`}
    >
      <Page size="A4" style={styles.page}>
        <Header basics={resume.basics} />

        <Section title="Summary">
          <Text>{resume.basics.summary}</Text>
        </Section>

        <Section title="Experience" wrap>
          {resume.work.map((entry) => (
            <WorkItem entry={entry} key={`${entry.name}-${entry.startDate}`} />
          ))}
        </Section>

        {resume.skills && resume.skills.length > 0 && (
          <Section title="Skills">
            {resume.skills.map((skill) => (
              <Text key={skill.name} style={styles.skillRow}>
                <Text style={styles.skillName}>{skill.name}: </Text>
                {skill.keywords.join(", ")}
              </Text>
            ))}
          </Section>
        )}

        {resume.education && resume.education.length > 0 && (
          <Section title="Education">
            {resume.education.map((entry) => (
              <EducationItem
                entry={entry}
                key={`${entry.institution}-${entry.startDate}`}
              />
            ))}
          </Section>
        )}

        {resume.languages && resume.languages.length > 0 && (
          <Section title="Languages">
            <Text>
              {resume.languages
                .map((lang) => `${lang.language} (${lang.fluency})`)
                .join("  ·  ")}
            </Text>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Open Source">
            {projects.map((entry) => (
              <ProjectItem entry={entry} key={entry.name} />
            ))}
          </Section>
        )}

        {talks.length > 0 && (
          <Section title="Talks">
            {talks.map((entry) => (
              <TalkItem
                entry={entry}
                key={`${entry.name}-${entry.startDate}`}
              />
            ))}
          </Section>
        )}

        {resume.volunteer && resume.volunteer.length > 0 && (
          <Section title="Volunteering">
            {resume.volunteer.map((entry) => (
              <VolunteerItem
                entry={entry}
                key={`${entry.organization}-${entry.startDate}`}
              />
            ))}
          </Section>
        )}
      </Page>
    </Document>
  );
};
