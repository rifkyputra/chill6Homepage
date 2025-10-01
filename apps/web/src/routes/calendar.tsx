import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  MapPin,
  Upload,
} from "lucide-react";
import moment from "moment";
import { useState, useCallback } from "react";
import {
  Calendar,
  momentLocalizer,
  type View,
  Views,
  type Event as BigCalendarEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FOOTER_CONTENT } from "@/lib/constants";

// Set locale for moment
moment.locale("id");
const localizer = momentLocalizer(moment);

export const Route = createFileRoute("/calendar")({
  component: CalendarComponent,
});

// Event interface for React Big Calendar
interface CalendarEvent extends BigCalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  type?: string;
}

// Sample events data transformed for React Big Calendar
const createEventTime = (date: Date, timeString: string, durationHours = 1) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setHours(start.getHours() + durationHours);

  return { start, end };
};

const sampleEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Gaming Tournament",
    ...createEventTime(new Date(2025, 8, 15), "14:00", 3), // 3 hours duration
    description: "PS4 tournament with prizes",
    location: "Gaming Zone",
    type: "gaming",
  },
  {
    id: 2,
    title: "Photo Session",
    ...createEventTime(new Date(2025, 8, 20), "10:00", 2), // 2 hours duration
    description: "Professional photo session booking",
    location: "Studio Foto",
    type: "photo",
  },
  {
    id: 3,
    title: "Coffee Tasting",
    ...createEventTime(new Date(2025, 8, 25), "16:00", 1), // 1 hour duration
    description: "Premium coffee and matcha tasting",
    location: "Cafe Area",
    type: "cafe",
  },
];

function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

  // Get events based on current view and date
  const getEventsForCurrentView = useCallback(() => {
    const now = currentDate;

    switch (currentView) {
      case Views.MONTH:
        return events.filter(
          (event) =>
            event.start.getMonth() === now.getMonth() &&
            event.start.getFullYear() === now.getFullYear()
        );

      case Views.WEEK:
        const startOfWeek = moment(now).startOf("week").toDate();
        const endOfWeek = moment(now).endOf("week").toDate();
        return events.filter(
          (event) => event.start >= startOfWeek && event.start <= endOfWeek
        );

      case Views.DAY:
        return events.filter((event) => moment(event.start).isSame(now, "day"));

      case Views.AGENDA:
        // For agenda view, show events from current date onwards (next 30 days)
        const agendaEnd = moment(now).add(30, "days").toDate();
        return events
          .filter((event) => event.start >= now && event.start <= agendaEnd)
          .sort((a, b) => a.start.getTime() - b.start.getTime());

      default:
        return events;
    }
  }, [events, currentDate, currentView]);

  // Get the title for the events list based on current view
  const getEventsListTitle = useCallback(() => {
    switch (currentView) {
      case Views.MONTH:
        return `Acara ${moment(currentDate).format("MMMM YYYY")}`;
      case Views.WEEK:
        const startWeek = moment(currentDate).startOf("week");
        const endWeek = moment(currentDate).endOf("week");
        return `Acara Minggu Ini (${startWeek.format("DD")} - ${endWeek.format(
          "DD MMM"
        )})`;
      case Views.DAY:
        return `Acara ${moment(currentDate).format("DD MMMM YYYY")}`;
      case Views.AGENDA:
        return `Agenda 30 Hari Ke Depan`;
      default:
        return "Daftar Acara";
    }
  }, [currentDate, currentView]);

  // Event styling based on type
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    let backgroundColor = "#3174ad";
    let borderColor = "#3174ad";

    switch (event.type) {
      case "gaming":
        backgroundColor = "#3b82f6"; // blue
        borderColor = "#2563eb";
        break;
      case "photo":
        backgroundColor = "#8b5cf6"; // purple
        borderColor = "#7c3aed";
        break;
      case "cafe":
        backgroundColor = "#f97316"; // orange
        borderColor = "#ea580c";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "6px",
        border: "none",
        color: "white",
        fontSize: "12px",
      },
    };
  }, []);

  // Navigate to different date
  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // Change view
  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  // ICS Export function (updated for Big Calendar events)
  const exportToICS = () => {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${FOOTER_CONTENT.COMPANY.NAME}//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${FOOTER_CONTENT.COMPANY.NAME} Events
X-WR-TIMEZONE:Asia/Jakarta
`;

    events.forEach((event) => {
      icsContent += `BEGIN:VEVENT
UID:${event.id}@chill6space.com
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
CATEGORIES:${event.type?.toUpperCase() || "GENERAL"}
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `chill6-events-${
      new Date().toISOString().split("T")[0]
    }.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ICS Import function (updated to create Big Calendar events)
  const importFromICS = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const importedEvents = parseICSContent(content);
        setEvents((prev) => [...prev, ...importedEvents]);
        alert(
          `Berhasil mengimpor ${importedEvents.length} acara dari file ICS!`
        );
      } catch (error) {
        console.error("Error parsing ICS file:", error);
        alert("Gagal mengimpor file ICS. Pastikan format file benar.");
      }
    };
    reader.readAsText(file);

    event.target.value = "";
  };

  // Updated ICS parser for Big Calendar format
  const parseICSContent = (content: string): CalendarEvent[] => {
    const lines = content.split("\n");
    const events: CalendarEvent[] = [];
    let currentEvent: Partial<CalendarEvent> = {};

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === "BEGIN:VEVENT") {
        currentEvent = {};
      } else if (trimmedLine === "END:VEVENT" && currentEvent.title) {
        events.push({
          id: Date.now() + Math.random(),
          title: currentEvent.title,
          start: currentEvent.start || new Date(),
          end: currentEvent.end || new Date(),
          description: currentEvent.description,
          location: currentEvent.location,
          type: currentEvent.type,
        });
        currentEvent = {};
      } else if (Object.keys(currentEvent).length > 0) {
        if (trimmedLine.startsWith("SUMMARY:")) {
          currentEvent.title = trimmedLine.substring(8);
        } else if (trimmedLine.startsWith("DESCRIPTION:")) {
          currentEvent.description = trimmedLine.substring(12);
        } else if (trimmedLine.startsWith("LOCATION:")) {
          currentEvent.location = trimmedLine.substring(9);
        } else if (trimmedLine.startsWith("DTSTART:")) {
          const dateStr = trimmedLine.substring(8);
          currentEvent.start = new Date(
            `${dateStr.substring(0, 4)}-${dateStr.substring(
              4,
              6
            )}-${dateStr.substring(6, 8)}T${dateStr.substring(
              9,
              11
            )}:${dateStr.substring(11, 13)}:${dateStr.substring(13, 15)}`
          );
        } else if (trimmedLine.startsWith("DTEND:")) {
          const dateStr = trimmedLine.substring(6);
          currentEvent.end = new Date(
            `${dateStr.substring(0, 4)}-${dateStr.substring(
              4,
              6
            )}-${dateStr.substring(6, 8)}T${dateStr.substring(
              9,
              11
            )}:${dateStr.substring(11, 13)}:${dateStr.substring(13, 15)}`
          );
        }
      }
    }

    return events;
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-bold text-4xl md:text-5xl">
            Kalender Acara
          </h1>
          <p className="mx-auto max-w-2xl text-indigo-100 text-lg md:text-xl">
            Jangan lewatkan acara-acara menarik di {FOOTER_CONTENT.COMPANY.NAME}
            . Daftar dan ikuti berbagai aktivitas seru kami.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Calendar Header with Import/Export */}
          <div className="mb-8 flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-y-0">
            <div className="flex items-center space-x-4">
              <h2 className="font-bold text-2xl">
                Kalender Acara {FOOTER_CONTENT.COMPANY.NAME}
              </h2>
            </div>

            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
              {/* Import/Export Buttons */}
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".ics,.ical"
                  onChange={importFromICS}
                  className="hidden"
                  id="ics-import"
                />
                <label htmlFor="ics-import">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="cursor-pointer"
                  >
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Import</span> ICS
                    </span>
                  </Button>
                </label>

                <Button variant="outline" size="sm" onClick={exportToICS}>
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span> ICS
                </Button>
              </div>
            </div>
          </div>

          {/* Big Calendar Container */}
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Kalender
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px]">
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      titleAccessor="title"
                      view={currentView}
                      views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                      date={currentDate}
                      onNavigate={handleNavigate}
                      onView={handleViewChange}
                      popup
                      eventPropGetter={eventStyleGetter}
                      messages={{
                        next: "Berikutnya",
                        previous: "Sebelumnya",
                        today: "Hari Ini",
                        month: "Bulan",
                        week: "Minggu",
                        day: "Hari",
                        agenda: "Agenda",
                        date: "Tanggal",
                        time: "Waktu",
                        event: "Acara",
                        noEventsInRange: "Tidak ada acara dalam rentang ini.",
                        showMore: (total: number) => `+${total} lainnya`,
                      }}
                      formats={{
                        monthHeaderFormat: "MMMM YYYY",
                        dayHeaderFormat: "dddd, DD MMMM",
                        dayRangeHeaderFormat: ({
                          start,
                          end,
                        }: {
                          start: Date;
                          end: Date;
                        }) =>
                          `${moment(start).format("DD MMM")} - ${moment(
                            end
                          ).format("DD MMM YYYY")}`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List Sidebar */}
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg">
                  {getEventsListTitle()}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {getEventsForCurrentView().length} acara ditemukan
                </p>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {getEventsForCurrentView().length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                      <p>Tidak ada acara untuk periode ini</p>
                    </CardContent>
                  </Card>
                ) : (
                  getEventsForCurrentView().map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base leading-tight">
                              {event.title}
                            </CardTitle>
                            {event.description && (
                              <CardDescription className="text-sm mt-1">
                                {event.description}
                              </CardDescription>
                            )}
                          </div>
                          {event.type && (
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ml-2 flex-shrink-0 ${
                                event.type === "gaming"
                                  ? "bg-blue-100 text-blue-800"
                                  : event.type === "photo"
                                  ? "bg-purple-100 text-purple-800"
                                  : event.type === "cafe"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {event.type}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span>
                              {currentView === Views.DAY
                                ? moment(event.start).format(
                                    "dddd, DD MMMM YYYY"
                                  )
                                : moment(event.start).format(
                                    "ddd, DD MMM YYYY"
                                  )}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span>
                              {moment(event.start).format("HH:mm")} -{" "}
                              {moment(event.end).format("HH:mm")}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
