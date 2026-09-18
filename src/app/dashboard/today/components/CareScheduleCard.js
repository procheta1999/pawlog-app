import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DashboardButton from '../../components/DashboardButton';
import EventIcon from '@mui/icons-material/Event';
import MedicationIcon from '@mui/icons-material/Medication';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Timeline from '../../components/Timeline';
import { getCareScheduleTimelineItems } from '@/app/utils/eventUtils';

const eventIcons = {
    meal: RestaurantIcon,
    walk: DirectionsWalkIcon,
    medication: MedicationIcon,
};

export default function CareScheduleCard({
    handleOpenCareScheduleModal,
    careSchedules = [],
    onEventMenuAction = () => { },
}) {
    const handleOpenModal = () => {
        handleOpenCareScheduleModal(true);
    };
    const timelineItems = getCareScheduleTimelineItems(
        careSchedules,
        eventIcons,
        EventIcon,
    );

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    What&apos;s your pet&apos;s care schedule?
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Before setting up care events, we want to know the care schedule of your pet which will help us setup the care timeline better</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Please make sure your pet&apos;s stomach is not empty for more than 6-7 hours because that might lead to gastristis. Please consult the vet for further details.
                </Typography>
                {timelineItems.length > 0 && (
                    <Timeline items={timelineItems} onEventMenuAction={onEventMenuAction} />
                )}
            </CardContent>
            <CardActions>
                <DashboardButton
                    onClick={handleOpenModal}
                >
                    Record care schedule
                </DashboardButton>
            </CardActions>
        </Card>
    );
}
