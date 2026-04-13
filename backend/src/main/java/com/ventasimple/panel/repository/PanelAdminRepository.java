package com.ventasimple.panel.repository;

import com.ventasimple.panel.model.PanelAdmin;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface PanelAdminRepository extends JpaRepository<PanelAdmin, UUID> {
    Optional<PanelAdmin> findByEmail(String email);
}
