import { ReactNode } from "react";

type TableCellWrapperType = {
    showGrid: boolean;
    children?: ReactNode;
};

// Errors if tables do not have proper nested children
// e.g. <div> direct child of <tr>
export default function TableCellWrapper({
    showGrid,
    children,
}: TableCellWrapperType) {
    return showGrid ? (
        <>{children}</>
    ) : (
        <tr>
            <td>{children}</td>
        </tr>
    );
}
