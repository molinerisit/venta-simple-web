package com.ventasimple.panel.repository;

import com.ventasimple.panel.model.ComandoRemoto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface ComandoRemotoRepository extends JpaRepository<ComandoRemoto, UUID> {
    List<ComandoRemoto> findByInstalacionIdAndEstado(UUID id, ComandoRemoto.Estado estado);
    List<ComandoRemoto> findByInstalacionIdOrderByCreadoAtDesc(UUID id);
}
