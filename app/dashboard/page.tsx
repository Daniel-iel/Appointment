'use client';

import { useState } from 'react';
import { Appointment, Folga } from '@/lib/types';
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage';
import { useFolgaStorage } from '@/hooks/useFolgaStorage';
import { useCombinedAnalytics } from '@/hooks/useCombinedAnalytics';
import { useFilters } from '@/hooks/useFilters';
import { colors } from '@/styles/design-tokens';

// Layout & Dashboard Components
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { ChartGrid, ChartCard } from '@/components/dashboard/ChartGrid';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { ImportButton } from '@/components/dashboard/ImportButton';

// Chart Components
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Heatmap } from '@/components/charts/Heatmap';

// Filter Components
import { PeriodSelector } from '@/components/filters/PeriodSelector';

// Appointment Components
import { AppointmentModal } from '@/components/appointments/AppointmentModal';
import { AppointmentList } from '@/components/appointments/AppointmentList';

// Folga Components
import { FolgaModal } from '@/components/folga/FolgaModal';
import { FolgaList } from '@/components/folga/FolgaList';

// Icons
import { Plus, Sunrise } from 'lucide-react';

export default function DashboardPage() {
  const { appointments, isLoaded: appointmentsLoaded, add, update, delete: deleteAppointment } = useAppointmentStorage();
  const { folgas, isLoaded: folgasLoaded, add: addFolga, update: updateFolga, delete: deleteFolga } = useFolgaStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFolgaModalOpen, setIsFolgaModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFolga, setEditingFolga] = useState<Folga | null>(null);
  const [isEditFolgaModalOpen, setIsEditFolgaModalOpen] = useState(false);
  
  const isLoaded = appointmentsLoaded && folgasLoaded;
  
  // Filters
  const {
    selectedPeriod,
    customRange,
    filteredAppointments,
    filteredFolgas,
    handlePeriodChange,
  } = useFilters(appointments, folgas);

  // Analytics with folga integration
  const {
    stats,
    dailyData,
    weeklyData,
    timeSeriesData,
    distributionData,
    heatmapData,
  } = useCombinedAnalytics(filteredAppointments, filteredFolgas);

  const handleAddAppointment = (data: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
  }) => {
    add(data.startDate, data.startTime, data.endDate, data.endTime, data.description);
  };

  const handleAddFolga = (data: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
    hasLunchBreak?: boolean;
    lunchDuration?: number;
  }) => {
    addFolga(
      data.startDate,
      data.startTime,
      data.endDate,
      data.endTime,
      data.description,
      data.hasLunchBreak || false,
      data.lunchDuration || 1
    );
  };

  const handleImportAppointments = (importedAppointments: any[]) => {
    importedAppointments.forEach((apt) => {
      add(apt);
    });
  };

  const handleImportFolgas = (importedFolgas: any[]) => {
    importedFolgas.forEach((folga) => {
      addFolga(
        folga.startDate,
        folga.startTime,
        folga.endDate,
        folga.endTime,
        folga.description,
        folga.hasLunchBreak || false,
        folga.lunchDuration || 1
      );
    });
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleUpdateAppointment = (data: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
  }) => {
    if (editingAppointment) {
      update({
        ...editingAppointment,
        ...data,
      });
      setEditingAppointment(null);
      setIsEditModalOpen(false);
    }
  };

  const handleEditFolga = (folga: Folga) => {
    setEditingFolga(folga);
    setIsEditFolgaModalOpen(true);
  };

  const handleUpdateFolga = (data: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
    hasLunchBreak?: boolean;
    lunchDuration?: number;
  }) => {
    if (editingFolga) {
      updateFolga({
        ...editingFolga,
        ...data,
      });
      setEditingFolga(null);
      setIsEditFolgaModalOpen(false);
    }
  };

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.canvas, color: colors.ink }}
      >
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardLayout
        title="ExtraTime Dashboard"
        subtitle={`${appointments.length} work entries • ${folgas.length} time-off • ${filteredAppointments.length + filteredFolgas.length} filtered`}
        actions={
          <div className="flex items-center gap-3">
            <ImportButton 
              onImportAppointments={handleImportAppointments}
              onImportFolgas={handleImportFolgas}
            />
            <ExportButton appointments={filteredAppointments} folgas={filteredFolgas} />
            <button
              onClick={() => setIsFolgaModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: colors['product-vault'],
                color: colors.canvas,
              }}
            >
              <Sunrise className="w-4 h-4" />
              Add Time-Off
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: colors['product-terraform'],
                color: colors.ink,
              }}
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Period Selector */}
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            customRange={customRange}
            onPeriodChange={handlePeriodChange}
          />

          {/* KPI Metrics */}
          <MetricsGrid metrics={stats} />

          {/* Charts Grid */}
          <ChartGrid columns={2}>
            <ChartCard fullWidth>
              <LineChart
                data={timeSeriesData}
                xKey="date"
                lines={[
                  { dataKey: 'hours', name: 'Hours Worked', color: colors['product-terraform'] },
                  { dataKey: 'cumulativeBalance', name: 'Cumulative Balance', color: colors['product-waypoint'] },
                ]}
                title="Time Series Trend"
                height={320}
              />
            </ChartCard>

            <ChartCard>
              <BarChart
                data={weeklyData}
                xKey="weekLabel"
                bars={[
                  { dataKey: 'hours', name: 'Hours Worked', color: colors['product-waypoint'] },
                  { dataKey: 'expectedHours', name: 'Expected Hours', color: colors['product-vault'] },
                ]}
                title="Weekly Comparison"
                height={320}
              />
            </ChartCard>

            <ChartCard>
              <PieChart
                data={distributionData}
                title="Time Distribution by Period"
                height={320}
                isDonut={true}
              />
            </ChartCard>

            <ChartCard fullWidth>
              <Heatmap
                data={heatmapData}
                title="Activity Heatmap"
              />
            </ChartCard>
          </ChartGrid>

          {/* Appointments List */}
          <div className="card p-6" style={{ borderColor: colors['hairline-soft'] }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.ink }}>
              Recent Entries ({filteredAppointments.length})
            </h2>
            <AppointmentList
              appointments={filteredAppointments}
              onDelete={deleteAppointment}
              onEdit={handleEditAppointment}
            />
          </div>

          {/* Folgas (Time-Off) List */}
          <div className="card p-6" style={{ borderColor: `${colors['product-vault']}30` }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.ink }}>
              Time-Off History ({filteredFolgas.length})
            </h2>
            <FolgaList
              folgas={filteredFolgas}
              onDelete={deleteFolga}
              onEdit={handleEditFolga}
            />
          </div>
        </div>
      </DashboardLayout>

      {/* Add Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAppointment}
      />

      {/* Edit Appointment Modal */}
      <AppointmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleUpdateAppointment}
        initialData={editingAppointment || undefined}
        mode="edit"
      />

      {/* Add Folga Modal */}
      <FolgaModal
        isOpen={isFolgaModalOpen}
        onClose={() => setIsFolgaModalOpen(false)}
        onSubmit={handleAddFolga}
      />

      {/* Edit Folga Modal */}
      <FolgaModal
        isOpen={isEditFolgaModalOpen}
        onClose={() => {
          setIsEditFolgaModalOpen(false);
          setEditingFolga(null);
        }}
        onSubmit={handleUpdateFolga}
        initialData={editingFolga || undefined}
        mode="edit"
      />
    </>
  );
}
