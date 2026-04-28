import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
    onNewMember: () => void;
    onExportExcel?: () => void;
    onExportByCondition?: () => void;
}

const ActionButtons = ({
    onNewMember,
    onExportExcel,
    onExportByCondition
}: ActionButtonsProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button onClick={onNewMember}>New</Button>
            <Button onClick={onExportExcel}>Export Excel</Button>
            <Button onClick={onExportByCondition}>Export by condition</Button>
        </div>
    );
};

export default ActionButtons;