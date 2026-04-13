package com.ventasimple.panel.repository;

import com.ventasimple.panel.model.Suscripcion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, UUID> {
    List<Suscripcion> findByInstalacionIdOrderByInicioAtDesc(UUID id);
    Optional<Suscripcion> findFirstByInstalacionIdAndEstadoOrderByInicioAtDesc(UUID id, Suscripcion.Estado estado);
}
