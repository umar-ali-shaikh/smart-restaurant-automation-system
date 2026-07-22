import { useCallback, useEffect, useState } from "react";

import { menuService } from "../features/menu/services/menuService";
import { staffService } from "../features/staff/services/staffService";
import { tableService } from "../features/tables/services/tableService";

const initialState = {
  menu: [],
  tables: [],
  staff: [],
  loading: true,
  error: "",
};

export function useMesaStore() {
  const [state, setState] = useState(initialState);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));

    const [menuResult, tablesResult, staffResult] = await Promise.allSettled([
        menuService.getAll(),
        tableService.getAll(),
        staffService.getAll(),
      ]);

    setState({
      menu: menuResult.status === "fulfilled" ? menuResult.value : [],
      tables: tablesResult.status === "fulfilled" ? tablesResult.value : [],
      staff: staffResult.status === "fulfilled" ? staffResult.value : [],
      loading: false,
      error: [menuResult, tablesResult, staffResult]
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason?.message)
        .filter(Boolean)
        .join(" | "),
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      await refresh();
    };

    load();
  }, [refresh]);

  return {
    ...state,
    refresh,
    setMenu: (nextMenu) => setState((current) => ({
      ...current,
      menu: typeof nextMenu === "function" ? nextMenu(current.menu) : nextMenu,
    })),
    setTables: (nextTables) => setState((current) => ({
      ...current,
      tables: typeof nextTables === "function" ? nextTables(current.tables) : nextTables,
    })),
    setStaff: (nextStaff) => setState((current) => ({
      ...current,
      staff: typeof nextStaff === "function" ? nextStaff(current.staff) : nextStaff,
    })),
  };
}
