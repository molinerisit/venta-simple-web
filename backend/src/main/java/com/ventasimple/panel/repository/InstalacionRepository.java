package com.ventasimple.panel.repository;

import com.ventasimple.panel.model.Instalacion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.*;

@Repository
public interface InstalacionRepository extends JpaRepository<Instalacion, UUID> {
    Optional<Instalacion> findByInstallToken(String token);
    List<Instalacion> findByActivaTrue();
    List<Instalacion> findByPlan(Instalacion.Plan plan);
    long countByActivaTrue();
    long countByLastSeenAtAfter(Instant threshold);
}
